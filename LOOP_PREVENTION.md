# Loop Prevention System

This document describes the comprehensive loop prevention mechanisms implemented in groq-code-cli to ensure the application **never loops infinitely** under any circumstances.

## Overview

The loop prevention system implements multiple layers of protection with **absolute hard limits** that cannot be bypassed or overridden by user input or model behavior.

## Hard Limits

### 1. Consecutive Tool Calls Limit
- **Limit**: 10 consecutive tool calls
- **Behavior**: When exceeded, the conversation is **immediately terminated**
- **Reset**: Automatically resets when the model provides a final response without tool calls
- **Purpose**: Prevents infinite tool chaining loops

### 2. Total Session Iterations Limit
- **Limit**: 100 total iterations per session
- **Behavior**: When exceeded, the conversation is **immediately terminated**
- **Reset**: Only via `/clear` command
- **Purpose**: Prevents accumulation of iterations across multiple conversations

### 3. Error Count Limit
- **Limit**: 5 errors per session
- **Behavior**: When exceeded, the conversation is **immediately terminated**
- **Reset**: Only via `/clear` command
- **Purpose**: Prevents infinite error recovery loops

### 4. Conversation Cycle Limit
- **Limit**: 25 iterations per conversation cycle
- **Behavior**: Asks user to continue, but enforces absolute session limits
- **Reset**: User can choose to continue (limited by session limits)
- **Purpose**: Provides checkpoints for long conversations

### 5. Session Duration Limit
- **Limit**: 30 minutes per session
- **Behavior**: When exceeded, the conversation is **immediately terminated**
- **Reset**: Only via `/clear` command
- **Purpose**: Prevents runaway sessions that consume resources indefinitely

### 6. Maximum Resets Limit
- **Limit**: 2 iteration resets per conversation
- **Behavior**: When exceeded, prevents further iteration resets
- **Reset**: Starts fresh with each new user message
- **Purpose**: Prevents infinite reset loops

## Implementation Details

### Agent Class Changes

1. **New Properties**:
   - `consecutiveToolCalls`: Tracks consecutive tool calls (reduced from 20 to 10)
   - `totalIterationsThisSession`: Tracks total iterations across all conversations
   - `errorCount`: Tracks errors in the current session
   - `sessionStartTime`: Tracks when the session started
   - Various `max*` properties defining hard limits

2. **Loop Prevention Logic**:
   - Checks are performed at multiple points in the conversation loop
   - All limits are enforced with immediate termination
   - No exceptions or overrides are allowed

3. **Session Management**:
   - `clearHistory()` resets all counters and timers
   - `getSessionStats()` provides current usage statistics

### UI Integration

1. **New `/stats` Command**:
   - Shows current usage against all limits
   - Displays session duration
   - Provides guidance on using `/clear` to reset

2. **Enhanced Error Messages**:
   - Clear indication when limits are reached
   - Instructions on how to reset and continue

## Safety Guarantees

### Absolute Prevention
- **No infinite loops**: All limits are hard-coded and cannot be bypassed
- **No user override**: Users cannot disable or increase limits
- **No model override**: The AI model cannot bypass these restrictions
- **Fail-safe design**: When in doubt, the system terminates rather than continues

### Multiple Layers
1. **Per-conversation limits**: Prevent single conversation from running away
2. **Per-session limits**: Prevent accumulation across multiple conversations
3. **Time-based limits**: Prevent long-running sessions regardless of activity
4. **Error-based limits**: Prevent error recovery loops
5. **Tool-based limits**: Prevent infinite tool chaining

### Recovery Mechanisms
- **Graceful termination**: Clear messages explaining why termination occurred
- **Easy reset**: Simple `/clear` command resets all counters
- **Statistics tracking**: `/stats` command shows current usage
- **User guidance**: Clear instructions on how to proceed

## Usage

### Monitoring Session Usage
```
/stats
```
Shows current usage against all limits.

### Resetting Session
```
/clear
```
Resets all counters and starts fresh.

### Understanding Limits
The system will automatically terminate and provide clear messages when any limit is reached. Users should use `/clear` to reset and continue with a fresh session.

## Testing

The loop prevention system has been tested to ensure:
- All limits are properly initialized
- Counters increment correctly
- Termination occurs at the right thresholds
- Reset functionality works properly
- Statistics are accurate

## Conclusion

This comprehensive loop prevention system ensures that groq-code-cli will **never loop infinitely** under any circumstances. The multiple layers of protection, hard limits, and fail-safe design provide absolute guarantees against runaway behavior while maintaining usability through clear feedback and easy recovery mechanisms.