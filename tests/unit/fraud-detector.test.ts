import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    donation: {
      count: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
    },
    contact: {
      findUnique: vi.fn(),
    },
  },
}));

// Import after mocks
import { calculateFraudScore } from '@/lib/security/fraud-detector';

describe('Fraud Detection System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Velocity Detection', () => {
    it('should flag extreme velocity (5+ donations in 5 minutes)', async () => {
      // Mock 5 recent donations in last 5 minutes
      vi.mocked(prisma.donation.count).mockResolvedValue(5);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 10,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudScore).toBeGreaterThanOrEqual(30);
      expect(result.fraudFlags).toContain('EXTREME_VELOCITY');
      expect(result.reviewStatus).toBe('REJECTED');
    });

    it('should flag high velocity (3-4 donations in 5 minutes)', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(3);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 10,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudScore).toBeGreaterThanOrEqual(20);
      expect(result.fraudFlags).toContain('HIGH_VELOCITY');
    });

    it('should pass normal donation rate (< 2 in 5 minutes)', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(1);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 50,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudFlags).not.toContain('EXTREME_VELOCITY');
      expect(result.fraudFlags).not.toContain('HIGH_VELOCITY');
    });
  });

  describe('Contact History Analysis', () => {
    it('should flag contact with previous fraud', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue({
        id: 'test-contact',
        fraudScoreTotal: 250, // High historical fraud
        donationCount: 3,
      } as any);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 50,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudScore).toBeGreaterThan(0);
      expect(result.fraudFlags).toContain('PREVIOUS_FRAUD_HIGH');
    });

    it('should give low score to returning donors with clean history', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue({
        id: 'test-contact',
        fraudScoreTotal: 10, // Low historical fraud
        donationCount: 20, // Many previous donations
      } as any);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 20 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 50,
        method: 'CREDIT_CARD',
      });

      // Returning donor bonus should reduce score
      expect(result.fraudScore).toBeLessThan(40);
      expect(result.reviewStatus).toBe('APPROVED');
    });
  });

  describe('Amount Anomaly Detection', () => {
    it('should flag penny testing ($1-$2 donations)', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 1.5,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudFlags).toContain('PENNY_TESTING');
      expect(result.fraudScore).toBeGreaterThan(0);
    });

    it('should flag exact round amounts ($5.00, $10.00)', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 5.00,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudFlags).toContain('ROUND_AMOUNT');
    });

    it('should pass natural amounts ($47.23, $125.50)', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 47.23,
        method: 'CREDIT_CARD',
      });

      expect(result.fraudFlags).not.toContain('PENNY_TESTING');
      expect(result.fraudFlags).not.toContain('ROUND_AMOUNT');
    });
  });

  describe('Payment Method Risk', () => {
    it('should flag high-risk payment methods', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 50,
        method: 'CRYPTOCURRENCY',
      });

      expect(result.fraudFlags).toContain('HIGH_RISK_METHOD');
      expect(result.fraudScore).toBeGreaterThan(0);
    });

    it('should pass low-risk payment methods', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 50,
        method: 'CHECK',
      });

      expect(result.fraudFlags).not.toContain('HIGH_RISK_METHOD');
    });
  });

  describe('Review Status Logic', () => {
    it('should REJECT donations with score >= 70', async () => {
      // Simulate extreme velocity (30 points) + previous fraud high (25 points) + penny testing (15 points) = 70
      vi.mocked(prisma.donation.count).mockResolvedValue(5); // Extreme velocity
      vi.mocked(prisma.contact.findUnique).mockResolvedValue({
        id: 'test-contact',
        fraudScoreTotal: 250, // Previous fraud
        donationCount: 3,
      } as any);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 3 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 1.5, // Penny testing
        method: 'CREDIT_CARD',
      });

      expect(result.fraudScore).toBeGreaterThanOrEqual(70);
      expect(result.reviewStatus).toBe('REJECTED');
    });

    it('should flag PENDING_REVIEW for scores 40-69', async () => {
      // Simulate moderate risk
      vi.mocked(prisma.donation.count).mockResolvedValue(3); // High velocity (20 points)
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 1 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 5.00, // Round amount (10 points)
        method: 'CREDIT_CARD',
      });

      expect(result.fraudScore).toBeGreaterThanOrEqual(40);
      expect(result.fraudScore).toBeLessThan(70);
      expect(result.reviewStatus).toBe('PENDING_REVIEW');
    });

    it('should APPROVE donations with score < 40', async () => {
      vi.mocked(prisma.donation.count).mockResolvedValue(0);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue({
        id: 'test-contact',
        fraudScoreTotal: 0,
        donationCount: 10, // Returning donor
      } as any);
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 50 },
        _count: { _all: 10 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'test-contact',
        amount: 100,
        method: 'CHECK',
      });

      expect(result.fraudScore).toBeLessThan(40);
      expect(result.reviewStatus).toBe('APPROVED');
    });
  });

  describe('Bot Attack Scenario (Real-World)', () => {
    it('should block Allyra-style bot attack (100x $1 donations)', async () => {
      // Simulate rapid-fire $1 donations
      vi.mocked(prisma.donation.count).mockResolvedValue(10); // 10 in last 5 minutes
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null); // New contact
      vi.mocked(prisma.donation.findMany).mockResolvedValue([]);
      vi.mocked(prisma.donation.aggregate).mockResolvedValue({
        _avg: { amount: 1 },
        _count: { _all: 10 },
        _sum: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await calculateFraudScore({
        organizationId: 'test-org',
        contactId: 'bot-contact',
        amount: 1.00,
        method: 'CREDIT_CARD',
      });

      // Should trigger:
      // - EXTREME_VELOCITY (30 points)
      // - PENNY_TESTING (15 points)
      // - ROUND_AMOUNT (10 points)
      // - NEW_CONTACT (no bonus reduction)
      // Total: 55+ points = PENDING_REVIEW or REJECTED

      expect(result.fraudScore).toBeGreaterThan(50);
      expect(result.fraudFlags).toContain('EXTREME_VELOCITY');
      expect(result.fraudFlags).toContain('PENNY_TESTING');
      expect(['PENDING_REVIEW', 'REJECTED']).toContain(result.reviewStatus);
    });
  });
});
