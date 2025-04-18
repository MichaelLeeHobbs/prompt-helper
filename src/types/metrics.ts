// src/types/metrics.ts

/**
 * Shape of an FTA complexity metric result.
 */
export interface FtaMetrics {
  file_name: string;
  cyclo: number;
  halstead: {
    uniq_operators: number;
    uniq_operands: number;
    total_operators: number;
    total_operands: number;
    program_length: number;
    vocabulary_size: number;
    volume: number;
    difficulty: number;
    effort: number;
    time: number;
    bugs: number;
  };
  line_count: number;
  fta_score: number;
  assessment: string;
}
