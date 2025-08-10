import Colors from "@/constants/Colors";
import { Filter, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilter?: () => void;
  showFilter?: boolean;
  disabled?: boolean;
}

export default function SearchBar({
  placeholder = "Search events...",
  value,
  onChangeText,
  onClear,
  onFilter,
  showFilter = false,
  disabled = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

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
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    minHeight: 56,
  },
  searchContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchContainerDisabled: {
    opacity: 0.6,
    backgroundColor: "#f5f5f5",
  },
  searchIconContainer: {
    paddingLeft: 20,
    paddingRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  clearButton: {
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0, 0, 0, 0.1)",
  },
});
