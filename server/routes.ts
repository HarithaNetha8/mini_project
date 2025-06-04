import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScanSchema, insertFeedbackSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// URL analysis function
function analyzeUrl(url: string): { verdict: "safe" | "phishing" | "suspicious", confidence: number, details: string[] } {
  const details: string[] = [];
  let suspiciousScore = 0;

  // Normalize URL
  let normalizedUrl = url.trim().toLowerCase();
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const urlObj = new URL(normalizedUrl);
    
    // Check for IP address domains
    if (/^\d+\.\d+\.\d+\.\d+/.test(urlObj.hostname)) {
      suspiciousScore += 30;
      details.push("Domain uses IP address instead of domain name");
    }

    // Check for suspicious paths
    const suspiciousPaths = ['/wp-content/', '.php', '/secure/', '/login/', '/account/', '/verify/'];
    const path = urlObj.pathname.toLowerCase();
    for (const suspiciousPath of suspiciousPaths) {
      if (path.includes(suspiciousPath)) {
        suspiciousScore += 15;
        details.push(`Suspicious path detected: ${suspiciousPath}`);
      }
    }

    // Check for double slashes
    if (path.includes('//')) {
      suspiciousScore += 20;
      details.push("Double slashes detected in URL path");
    }

    // Check URL length
    if (normalizedUrl.length > 100) {
      suspiciousScore += 10;
      details.push("URL length exceeds normal limits");
    }

    // Check for suspicious subdomains
    const suspiciousSubdomains = ['secure', 'account', 'verify', 'update', 'confirm'];
    const hostname = urlObj.hostname.toLowerCase();
    for (const subdomain of suspiciousSubdomains) {
      if (hostname.includes(subdomain)) {
        suspiciousScore += 15;
        details.push(`Suspicious subdomain detected: ${subdomain}`);
      }
    }

    // Check for URL shorteners (common in phishing)
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'short.link'];
    if (shorteners.some(shortener => hostname.includes(shortener))) {
      suspiciousScore += 25;
      details.push("URL shortener detected");
    }

    // Determine verdict based on score
    let verdict: "safe" | "phishing" | "suspicious";
    let confidence: number;

    if (suspiciousScore >= 50) {
      verdict = "phishing";
      confidence = Math.min(85 + (suspiciousScore - 50) / 2, 98);
    } else if (suspiciousScore >= 25) {
      verdict = "suspicious";
      confidence = 60 + suspiciousScore;
    } else {
      verdict = "safe";
      confidence = Math.max(90 - suspiciousScore * 2, 70);
      details.push("Valid domain structure");
      details.push("No suspicious URL patterns detected");
    }

    return { verdict, confidence: Math.round(confidence), details };

  } catch (error) {
    return {
      verdict: "suspicious",
      confidence: 30,
      details: ["Invalid URL format"]
    };
  }
}

// Screenshot analysis function (mock implementation)
function analyzeScreenshot(filename: string, buffer: Buffer): { verdict: "safe" | "phishing" | "suspicious", confidence: number, details: string[] } {
  // Simulate text extraction and analysis
  const details: string[] = [];
  let suspiciousScore = 0;

  // Simulate finding suspicious keywords (in a real implementation, you'd use OCR)
  const suspiciousKeywords = [
    'account locked', 'verify account', 'update password', 'confirm identity',
    'suspended account', 'click here immediately', 'limited time', 'urgent action required'
  ];

  const loginKeywords = ['login', 'sign in', 'password', 'username'];
  const bankingKeywords = ['bank', 'credit card', 'social security', 'ssn'];

  // Mock detection based on filename and random analysis
  const mockText = filename.toLowerCase();
  
  // Simulate suspicious content detection
  if (Math.random() > 0.6) { // 40% chance of finding suspicious content
    suspiciousScore += 40;
    details.push("Suspicious login form detected");
    details.push("Urgent language patterns found");
  }

  if (Math.random() > 0.7) { // 30% chance
    suspiciousScore += 30;
    details.push("Mimics legitimate banking interface");
  }

  if (Math.random() > 0.8) { // 20% chance
    suspiciousScore += 25;
    details.push("Password field without proper security indicators");
  }

  // Determine verdict
  let verdict: "safe" | "phishing" | "suspicious";
  let confidence: number;

  if (suspiciousScore >= 60) {
    verdict = "phishing";
    confidence = Math.min(80 + (suspiciousScore - 60) / 2, 95);
  } else if (suspiciousScore >= 30) {
    verdict = "suspicious";
    confidence = 50 + suspiciousScore;
  } else {
    verdict = "safe";
    confidence = Math.max(85 - suspiciousScore, 60);
    details.push("No suspicious elements detected");
    details.push("Legitimate webpage structure");
  }

  return { verdict, confidence: Math.round(confidence), details };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get application stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Analyze URL
  app.post("/api/analyze/url", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL is required" });
      }

      // Perform analysis
      const analysis = analyzeUrl(url);
      
      // Store scan result
      const scanData = {
        type: "url" as const,
        target: url,
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        details: analysis.details,
      };

      const scan = await storage.createScan(scanData);
      
      res.json({
        scanId: scan.id,
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        details: analysis.details,
        analysisTime: Math.random() * 2 + 0.5, // Mock analysis time
      });
    } catch (error) {
      res.status(500).json({ message: "Analysis failed" });
    }
  });

  // Analyze screenshot
  app.post("/api/analyze/screenshot", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const { originalname, buffer } = req.file;
      
      // Perform analysis
      const analysis = analyzeScreenshot(originalname, buffer);
      
      // Store scan result
      const scanData = {
        type: "screenshot" as const,
        target: originalname,
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        details: analysis.details,
      };

      const scan = await storage.createScan(scanData);
      
      res.json({
        scanId: scan.id,
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        details: analysis.details,
        analysisTime: Math.random() * 3 + 1, // Mock analysis time
      });
    } catch (error) {
      res.status(500).json({ message: "Screenshot analysis failed" });
    }
  });

  // Get scan history
  app.get("/api/scans", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const scans = await storage.getScans(limit, offset);
      res.json(scans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scan history" });
    }
  });

  // Get specific scan
  app.get("/api/scans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scan = await storage.getScan(id);
      
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }
      
      res.json(scan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scan" });
    }
  });

  // Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      
      // Check if scan exists
      const scan = await storage.getScan(validatedData.scanId);
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }

      // Check if feedback already exists
      const existingFeedback = await storage.getFeedbackByScanId(validatedData.scanId);
      if (existingFeedback) {
        return res.status(400).json({ message: "Feedback already submitted for this scan" });
      }

      const feedback = await storage.createFeedback(validatedData);
      res.json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
