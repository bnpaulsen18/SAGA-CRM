import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

/**
 * IRS-Compliant Donation Receipt PDF Template
 *
 * This template generates professional, print-ready donation receipts
 * that comply with IRS tax-deductible contribution requirements.
 */

export interface DonationReceiptPDFProps {
  // Donation Details
  receiptNumber: string;
  donationId: string;
  amount: number;
  donationDate: string;
  paymentMethod: string;
  fundRestriction: string;
  campaignName?: string;

  // Donor Information
  donorName: string;
  donorEmail: string;

  // Organization Information
  organizationName: string;
  organizationEin: string;

  // AI-Generated Content
  thankYouMessage: string;
}

// PDF Styles - Professional, clean, print-ready
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: '#FFFFFF',
  },

  // Header Section
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2pt solid #764ba2',
  },
  organizationName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#764ba2',
    marginBottom: 5,
  },
  organizationDetails: {
    fontSize: 9,
    color: '#666666',
    marginTop: 5,
  },

  // Title Section
  titleSection: {
    marginTop: 20,
    marginBottom: 25,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  receiptNumber: {
    fontSize: 10,
    color: '#666666',
    marginTop: 5,
  },

  // Section Title
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#764ba2',
    marginTop: 20,
    marginBottom: 10,
    borderBottom: '1pt solid #EEEEEE',
    paddingBottom: 5,
  },

  // Details Grid
  detailsGrid: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: '35%',
    fontSize: 10,
    color: '#666666',
    fontFamily: 'Helvetica-Bold',
  },
  detailValue: {
    width: '65%',
    fontSize: 10,
    color: '#333333',
  },

  // Amount Highlight
  amountHighlight: {
    backgroundColor: '#F5F0F8',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    textAlign: 'center',
  },
  amountLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#764ba2',
  },

  // Thank You Message
  thankYouSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderLeft: '3pt solid #764ba2',
  },
  thankYouText: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.6,
  },

  // Tax Disclaimer
  disclaimerSection: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#FFF9E6',
    borderRadius: 5,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#8B6914',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.5,
    marginBottom: 5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    borderTop: '1pt solid #EEEEEE',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 3,
  },
});

export default function DonationReceiptPDF({
  receiptNumber,
  donationId,
  amount,
  donationDate,
  paymentMethod,
  fundRestriction,
  campaignName,
  donorName,
  donorEmail,
  organizationName,
  organizationEin,
  thankYouMessage,
}: DonationReceiptPDFProps) {
  // Format currency
  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format fund restriction for display
  const formatFundRestriction = (fund: string): string => {
    return fund
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header with Organization Info */}
        <View style={styles.header}>
          <Text style={styles.organizationName}>{organizationName}</Text>
          <Text style={styles.organizationDetails}>
            Tax ID (EIN): {organizationEin}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Tax-Deductible Donation Receipt</Text>
          <Text style={styles.receiptNumber}>Receipt #{receiptNumber}</Text>
          <Text style={styles.receiptNumber}>Issued: {currentDate}</Text>
        </View>

        {/* Amount Highlight */}
        <View style={styles.amountHighlight}>
          <Text style={styles.amountLabel}>Donation Amount</Text>
          <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
        </View>

        {/* Donor Information */}
        <Text style={styles.sectionTitle}>Donor Information</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{donorName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{donorEmail}</Text>
          </View>
        </View>

        {/* Donation Details */}
        <Text style={styles.sectionTitle}>Donation Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Donation Date:</Text>
            <Text style={styles.detailValue}>{donationDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fund Designation:</Text>
            <Text style={styles.detailValue}>{formatFundRestriction(fundRestriction)}</Text>
          </View>
          {campaignName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Campaign:</Text>
              <Text style={styles.detailValue}>{campaignName}</Text>
            </View>
          )}
        </View>

        {/* AI-Generated Thank You Message */}
        <View style={styles.thankYouSection}>
          <Text style={styles.thankYouText}>{thankYouMessage}</Text>
        </View>

        {/* IRS Tax Disclaimer */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>Tax Information</Text>
          <Text style={styles.disclaimerText}>
            {organizationName} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code.
          </Text>
          <Text style={styles.disclaimerText}>Tax ID (EIN): {organizationEin}</Text>
          <Text style={styles.disclaimerText}>
            No goods or services were provided in exchange for this contribution.
          </Text>
          <Text style={styles.disclaimerText}>
            This contribution is tax-deductible to the extent allowed by law.
          </Text>
          <Text style={styles.disclaimerText}>
            Please retain this receipt for your tax records.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is an official tax receipt. For questions, contact your organization.
          </Text>
          <Text style={styles.footerText}>Generated by SAGA CRM on {currentDate}</Text>
        </View>
      </Page>
    </Document>
  );
}
