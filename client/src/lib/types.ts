export interface AnalysisResult {
  scanId: number;
  verdict: 'safe' | 'phishing' | 'suspicious';
  confidence: number;
  details: string[];
  analysisTime: number;
}

export interface AppStats {
  totalScans: number;
  safeCount: number;
  phishingCount: number;
  suspiciousCount: number;
}
