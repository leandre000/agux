import Colors from "@/constants/Colors";
import { Filter, Search, X, Mic, Clock, TrendingUp } from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Animated,
    FlatList,
    Keyboard
} from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilter?: () => void;
  onSearch?: (query: string) => void;
  showFilter?: boolean;
  disabled?: boolean;
  showSuggestions?: boolean;
  recentSearches?: string[];
  popularSearches?: string[];
}

export default function SearchBar({
  placeholder = "Search events...",
  value,
  onChangeText,
  onClear,
  onFilter,
  onSearch,
  showFilter = false,
  disabled = false,
  showSuggestions = true,
  recentSearches = [],
  popularSearches = []
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && value.length === 0) {
      setShowSuggestionsList(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => {
      setShowSuggestionsList(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  const handleClear = () => {
    onChangeText("");
    onClear?.();
    setShowSuggestionsList(false);
  };

  const handleSearch = (query: string) => {
    onChangeText(query);
    onSearch?.(query);
    setShowSuggestionsList(false);
    Keyboard.dismiss();
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice search - in real app, integrate with speech recognition
    setTimeout(() => {
      setIsListening(false);
      // Mock voice input
      const mockVoiceInput = "music festival";
      onChangeText(mockVoiceInput);
      onSearch?.(mockVoiceInput);
    }, 2000);
  };

  const renderSuggestionItem = ({ item, type }: { item: string; type: 'recent' | 'popular' }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSearch(item)}
      activeOpacity={0.7}
    >
      {type === 'recent' ? (
        <Clock size={16} color={Colors.textSecondary} />
      ) : (
        <TrendingUp size={16} color={Colors.primary} />
      )}
      <Text style={[
        styles.suggestionText,
        type === 'popular' && styles.popularSuggestionText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const suggestionsData = [
    { title: 'Recent Searches', data: recentSearches, type: 'recent' as const },
    { title: 'Popular Searches', data: popularSearches, type: 'popular' as const }
  ];

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused,
        disabled && styles.searchContainerDisabled
      ]}>
        <View style={styles.searchIconContainer}>
          <Search 
            size={20} 
            color={isFocused ? Colors.primary : Colors.textSecondary} 
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (text.length > 0) {
              setShowSuggestionsList(false);
            } else if (isFocused) {
              setShowSuggestionsList(true);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => onSearch?.(value)}
        />
        
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoiceSearch}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Mic size={18} color={isListening ? Colors.primary : Colors.textSecondary} />
        </TouchableOpacity>
        
        {showFilter && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onFilter}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Filter size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Suggestions */}
      {showSuggestionsList && showSuggestions && (
        <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
          <FlatList
            data={suggestionsData}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.suggestionSection}>
                <Text style={styles.suggestionSectionTitle}>{item.title}</Text>
                {item.data.map((searchTerm, index) => 
                  renderSuggestionItem({ item: searchTerm, type: item.type })
                )}
              </View>
            )}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.inputBackground,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
  },
  searchContainerDisabled: {
    opacity: 0.6,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  voiceButton: {
    padding: 4,
    marginLeft: 8,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  voiceButtonActive: {
    backgroundColor: Colors.primary + '20',
  },
  filterButton: {
    padding: 4,
    marginLeft: 8,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary + '20',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionSection: {
    paddingVertical: 12,
  },
  suggestionSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  popularSuggestionText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});
