import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { 
  runBackendTestSuite, 
  logTestResults, 
  BackendTestSuite, 
  BackendTestResult 
} from '@/utils/backendTest';

interface TestResultItemProps {
  title: string;
  result: BackendTestResult;
}

const TestResultItem: React.FC<TestResultItemProps> = ({ title, result }) => (
  <View style={styles.testItem}>
    <View style={styles.testHeader}>
      <Text style={styles.testTitle}>{title}</Text>
      <Text style={[styles.testStatus, result.success ? styles.success : styles.failure]}>
        {result.success ? '✅ PASS' : '❌ FAIL'}
      </Text>
    </View>
    <Text style={styles.testMessage}>{result.message}</Text>
    {result.details && (
      <Text style={styles.testDetails}>
        {JSON.stringify(result.details, null, 2)}
      </Text>
    )}
  </View>
);

export default function BackendIntegrationTest() {
  const [testResults, setTestResults] = useState<BackendTestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await runBackendTestSuite();
      setTestResults(results);
      logTestResults(results);
      
      if (results.overall.success) {
        Alert.alert(
          '✅ Integration Tests Passed',
          'All backend integration tests passed successfully! Your app is ready for production.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          '⚠️ Integration Tests Failed',
          `${results.overall.message}. Please check the console for details.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        '❌ Test Error',
        `Failed to run integration tests: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Backend Integration Test</Text>
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.runButtonText}>Run Tests</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isRunning && !testResults && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Running backend integration tests...</Text>
          </View>
        )}

        {testResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.overallResult}>
              <Text style={styles.overallTitle}>Overall Result</Text>
              <Text style={[
                styles.overallStatus,
                testResults.overall.success ? styles.success : styles.failure
              ]}>
                {testResults.overall.success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}
              </Text>
              <Text style={styles.overallMessage}>{testResults.overall.message}</Text>
            </View>

            <View style={styles.testResults}>
              <Text style={styles.sectionTitle}>Test Details</Text>
              
              <TestResultItem
                title="Backend Connectivity"
                result={testResults.connectivity}
              />
              
              <TestResultItem
                title="Authentication System"
                result={testResults.auth}
              />
              
              <TestResultItem
                title="Events API"
                result={testResults.events}
              />
              
              <TestResultItem
                title="Payment System"
                result={testResults.payment}
              />
            </View>

            {testResults.overall.success && (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>
                  🎉 Your app is ready for production deployment!
                </Text>
                <Text style={styles.successSubtext}>
                  All backend integrations are working correctly.
                </Text>
              </View>
            )}
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  runButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 16,
  },
  resultsContainer: {
    gap: 20,
  },
  overallResult: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  overallTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overallStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overallMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  testResults: {
    gap: 12,
  },
  testItem: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  testStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  testMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  testDetails: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#1C1C1E',
    padding: 8,
    borderRadius: 4,
  },
  success: {
    color: '#34C759',
  },
  failure: {
    color: '#FF3B30',
  },
  successBanner: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  successText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtext: {
    color: '#34C759',
    fontSize: 14,
    textAlign: 'center',
  },
});
