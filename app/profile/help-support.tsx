import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft, ExternalLink, FileText, Mail, MessageCircle, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ContactOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I book tickets for an event?',
    answer: 'Browse events on the home screen, select your preferred event, choose your tickets, and complete the payment process. You\'ll receive a confirmation email with your tickets.',
  },
  {
    id: '2',
    question: 'Can I cancel or refund my tickets?',
    answer: 'Ticket refunds depend on the event organizer\'s policy. Most events allow refunds up to 24 hours before the event. Check the event details for specific refund terms.',
  },
  {
    id: '3',
    question: 'How do I access my tickets?',
    answer: 'Your tickets are available in the "Tickets" tab. You can also access them via the QR code sent to your email. Present the QR code at the event entrance.',
  },
  {
    id: '4',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit/debit cards, mobile money (MTN, Airtel), and PayPal. All payments are secure and encrypted.',
  },
  {
    id: '5',
    question: 'How do I update my profile information?',
    answer: 'Go to Profile > Account Settings > Edit Profile to update your personal information, profile picture, and preferences.',
  },
];

const contactOptions: ContactOption[] = [
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Get instant help from our support team',
    icon: <MessageCircle size={24} color={Colors.text} />,
    action: () => {
      Alert.alert('Live Chat', 'Live chat feature coming soon!');
    },
  },
  {
    id: 'phone',
    title: 'Call Support',
    subtitle: '+250 788 123 456',
    icon: <Phone size={24} color={Colors.text} />,
    action: () => {
      Linking.openURL('tel:+250788123456');
    },
  },
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'support@agura.com',
    icon: <Mail size={24} color={Colors.text} />,
    action: () => {
      Linking.openURL('mailto:support@agura.com');
    },
  },
];

interface FAQItemProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ item, isExpanded, onToggle }) => (
  <View style={styles.faqItem}>
    <TouchableOpacity 
      style={styles.faqQuestion} 
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.faqQuestionText}>{item.question}</Text>
      <ChevronDown 
        size={20} 
        color={Colors.textSecondary} 
        style={[styles.chevron, isExpanded && styles.chevronExpanded]} 
      />
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.faqAnswer}>
        <Text style={styles.faqAnswerText}>{item.answer}</Text>
      </View>
    )}
  </View>
);

interface ContactOptionProps {
  option: ContactOption;
}

const ContactOptionComponent: React.FC<ContactOptionProps> = ({ option }) => (
  <TouchableOpacity 
    style={styles.contactOption} 
    onPress={option.action}
    activeOpacity={0.7}
  >
    <View style={styles.contactIconContainer}>
      {option.icon}
    </View>
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>{option.title}</Text>
      <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
    </View>
    <ExternalLink size={20} color={Colors.textSecondary} />
  </TouchableOpacity>
 );

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handleFAQToggle = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleRateApp = () => {
    // In a real app, this would open the app store
    Alert.alert('Rate App', 'Thank you for your feedback!');
  };

  const handleShareApp = () => {
    // In a real app, this would share the app link
    Alert.alert('Share App', 'Share feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Contact Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <View style={styles.contactContainer}>
              {contactOptions.map((option) => (
                <ContactOptionComponent key={option.id} option={option} />
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqContainer}>
              {faqData.map((item) => (
                <FAQItemComponent
                  key={item.id}
                  item={item}
                  isExpanded={expandedFAQ === item.id}
                  onToggle={handleFAQToggle}
                />
              ))}
            </View>
          </View>

          {/* Additional Resources */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Resources</Text>
            <View style={styles.resourcesContainer}>
              <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
                <View style={styles.resourceIconContainer}>
                  <FileText size={24} color={Colors.text} />
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Terms of Service</Text>
                  <Text style={styles.resourceSubtitle}>Read our terms and conditions</Text>
                </View>
                <ExternalLink size={20} color={Colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
                <View style={styles.resourceIconContainer}>
                  <FileText size={24} color={Colors.text} />
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Privacy Policy</Text>
                  <Text style={styles.resourceSubtitle}>Learn about data protection</Text>
                </View>
                <ExternalLink size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App</Text>
            <View style={styles.appActionsContainer}>
              <TouchableOpacity 
                style={styles.appActionButton}
                onPress={handleRateApp}
                activeOpacity={0.7}
              >
                <Text style={styles.appActionText}>Rate Agura</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.appActionButton}
                onPress={handleShareApp}
                activeOpacity={0.7}
              >
                <Text style={styles.appActionText}>Share App</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Info */}
          <View style={styles.supportInfo}>
            <Text style={styles.supportInfoTitle}>🕒 Support Hours</Text>
            <Text style={styles.supportInfoText}>
              Monday - Friday: 8:00 AM - 8:00 PM{'\n'}
              Saturday: 9:00 AM - 6:00 PM{'\n'}
              Sunday: 10:00 AM - 4:00 PM
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  contactContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  faqContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  faqQuestionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resourcesContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resourceIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  resourceSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  appActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appActionButton: {
    flex: 1,
    backgroundColor: Colors.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  appActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  supportInfo: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  supportInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  supportInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
}); 