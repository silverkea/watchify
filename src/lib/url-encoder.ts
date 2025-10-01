/**
 * URL Encoding/Decoding Service for Stateless Watch Party Architecture
 * Handles encoding and decoding of watch party data for shareable URLs
 */

import { 
  ShareableURLData, 
  validateShareableURLData,
  optimizeForEncoding,
  estimateEncodedSize,
  isDataSizeValid,
  URL_ENCODING_CONSTRAINTS,
  URLEncodingError,
  URLDecodingError,
  URLSizeError
} from '@/types/shareable-url'

// Base64 URL-safe encoding/decoding utilities
function base64URLEncode(data: string): string {
  // Convert to base64 and make URL-safe
  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '') // Remove padding
}

function base64URLDecode(data: string): string {
  // Restore base64 format from URL-safe version
  let base64 = data
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '='
  }
  
  try {
    return atob(base64)
  } catch (error) {
    throw new URLDecodingError('Invalid base64 encoding', data)
  }
}

// JSON compression for URL encoding
function compressJSON(obj: any): string {
  // Remove unnecessary whitespace and use short property names
  const compressed = {
    w: obj.watchPartyId,      // watchPartyId
    m: obj.movieId,           // movieId  
    s: obj.scheduledTime,     // scheduledTime
    t: obj.movieTitle,        // movieTitle
    p: obj.moviePoster        // moviePoster
  }
  
  return JSON.stringify(compressed)
}

function decompressJSON(jsonString: string): ShareableURLData {
  try {
    const compressed = JSON.parse(jsonString)
    
    // Validate compressed format
    if (!compressed.w || !compressed.m || !compressed.s || !compressed.t) {
      throw new Error('Missing required fields in compressed data')
    }
    
    return {
      watchPartyId: compressed.w,
      movieId: compressed.m,
      scheduledTime: compressed.s,
      movieTitle: compressed.t,
      moviePoster: compressed.p || null
    }
  } catch (error) {
    throw new URLDecodingError(`Failed to decompress JSON: ${error}`, jsonString)
  }
}

// Main encoding function
export function encodeWatchPartyData(data: ShareableURLData): string {
  try {
    // Validate input data
    const validatedData = validateShareableURLData(data)
    
    // Optimize data for encoding
    const optimizedData = optimizeForEncoding(validatedData)
    
    // Check size constraints before encoding
    if (!isDataSizeValid(optimizedData)) {
      const estimatedSize = estimateEncodedSize(optimizedData)
      throw new URLSizeError(
        `Data too large for URL encoding: ${estimatedSize} bytes (max: ${URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH})`,
        estimatedSize,
        URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH
      )
    }
    
    // Compress and encode
    const jsonString = compressJSON(optimizedData)
    const encoded = base64URLEncode(jsonString)
    
    // Final size check
    if (encoded.length > URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH) {
      throw new URLSizeError(
        `Encoded data too large: ${encoded.length} characters (max: ${URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH})`,
        encoded.length,
        URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH
      )
    }
    
    return encoded
  } catch (error) {
    if (error instanceof URLSizeError || error instanceof URLEncodingError) {
      throw error
    }
    throw new URLEncodingError(`Failed to encode watch party data: ${error}`, data)
  }
}

// Main decoding function
export function decodeWatchPartyData(encodedData: string): ShareableURLData {
  try {
    // Validate input
    if (!encodedData || typeof encodedData !== 'string') {
      throw new URLDecodingError('Encoded data must be a non-empty string', encodedData)
    }
    
    // Decode from base64
    const jsonString = base64URLDecode(encodedData)
    
    // Decompress JSON
    const decompressedData = decompressJSON(jsonString)
    
    // Validate the resulting data
    const validatedData = validateShareableURLData(decompressedData)
    
    return validatedData
  } catch (error) {
    if (error instanceof URLDecodingError) {
      throw error
    }
    throw new URLDecodingError(`Failed to decode watch party data: ${error}`, encodedData)
  }
}

// URL generation helpers
export function generateWatchPartyURL(baseUrl: string, data: ShareableURLData): string {
  try {
    const encodedData = encodeWatchPartyData(data)
    const url = `${baseUrl}/watch-party/${data.watchPartyId}?data=${encodedData}`
    
    if (url.length > URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH) {
      throw new URLSizeError(
        `Generated URL too long: ${url.length} characters (max: ${URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH})`,
        url.length,
        URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH
      )
    }
    
    return url
  } catch (error) {
    throw new URLEncodingError(`Failed to generate watch party URL: ${error}`, data)
  }
}

export function parseWatchPartyURL(url: string): { watchPartyId: string; data: ShareableURLData } {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const watchPartyId = pathParts[pathParts.length - 1]
    const encodedData = urlObj.searchParams.get('data')
    
    if (!watchPartyId || !encodedData) {
      throw new Error('Invalid watch party URL format')
    }
    
    const data = decodeWatchPartyData(encodedData)
    
    // Validate that the URL ID matches the data ID
    if (data.watchPartyId !== watchPartyId) {
      throw new Error('Watch party ID mismatch between URL and data')
    }
    
    return { watchPartyId, data }
  } catch (error) {
    throw new URLDecodingError(`Failed to parse watch party URL: ${error}`, url)
  }
}

// Data validation and optimization helpers
export function validateEncodingSize(data: ShareableURLData): boolean {
  return isDataSizeValid(data)
}

export function getEncodingEstimate(data: ShareableURLData): {
  originalSize: number;
  compressedSize: number;
  encodedSize: number;
  isValid: boolean;
} {
  const originalJSON = JSON.stringify(data)
  const compressedJSON = compressJSON(data)
  const encodedSize = estimateEncodedSize(data)
  
  return {
    originalSize: originalJSON.length,
    compressedSize: compressedJSON.length,
    encodedSize: encodedSize,
    isValid: encodedSize <= URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH
  }
}

// Testing and debugging utilities
export function testRoundTrip(data: ShareableURLData): boolean {
  try {
    const encoded = encodeWatchPartyData(data)
    const decoded = decodeWatchPartyData(encoded)
    
    return JSON.stringify(data) === JSON.stringify(decoded)
  } catch {
    return false
  }
}

export function analyzeEncodingEfficiency(data: ShareableURLData): {
  compressionRatio: number;
  sizeSavings: number;
  isEfficient: boolean;
} {
  const original = JSON.stringify(data)
  const compressed = compressJSON(data)
  
  const compressionRatio = compressed.length / original.length
  const sizeSavings = original.length - compressed.length
  const isEfficient = compressionRatio < 0.8 // Good compression if less than 80% of original
  
  return {
    compressionRatio,
    sizeSavings,
    isEfficient
  }
}

// Error recovery helpers
export function sanitizeDataForEncoding(data: Partial<ShareableURLData>): ShareableURLData | null {
  try {
    // Attempt to fix common issues
    const sanitized = {
      watchPartyId: data.watchPartyId || '',
      movieId: data.movieId || 0,
      scheduledTime: data.scheduledTime || new Date().toISOString(),
      movieTitle: (data.movieTitle || '').slice(0, 100), // Truncate title
      moviePoster: data.moviePoster || null
    }
    
    // Validate the sanitized data
    validateShareableURLData(sanitized)
    return sanitized
  } catch {
    return null
  }
}

export function recoverFromEncodingError(error: Error, data: ShareableURLData): string | null {
  if (error instanceof URLSizeError) {
    // Try with shorter title
    const shortenedData = {
      ...data,
      movieTitle: data.movieTitle.slice(0, 50)
    }
    
    try {
      return encodeWatchPartyData(shortenedData)
    } catch {
      // Try with minimal data
      const minimalData = {
        ...data,
        movieTitle: data.movieTitle.slice(0, 20),
        moviePoster: null
      }
      
      try {
        return encodeWatchPartyData(minimalData)
      } catch {
        return null
      }
    }
  }
  
  return null
}