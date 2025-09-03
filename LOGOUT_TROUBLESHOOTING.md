# Logout Troubleshooting Guide

## Issue Description
The logout screen/functionality is not working properly in the Bible app.

## Potential Causes and Solutions

### 1. Firebase Auth State Issues

**Problem**: Firebase auth state might not be updating properly after logout.

**Solution**: 
- Check Firebase console for any auth errors
- Verify Firebase configuration in `lib/firebase.ts`
- Ensure proper error handling in auth state changes

### 2. Navigation Race Conditions

**Problem**: Navigation might be happening before auth state is fully updated.

**Solution**: 
- Added delays in navigation logic
- Improved state management in `useAuth` hook
- Better error handling in logout process

### 3. Browser Persistence Issues

**Problem**: Browser persistence might be keeping user logged in.

**Solution**:
- Clear browser cache and cookies
- Check if persistence is set correctly
- Force clear local storage on logout

### 4. State Management Issues

**Problem**: User state might not be clearing properly.

**Solution**:
- Force clear user state in `signOut` function
- Added immediate state updates
- Better error handling for state changes

## Debug Steps

### 1. Check Console Logs
Look for these log messages:
- `🔴 Starting sign out process...`
- `🔴 Firebase sign out successful`
- `🔴 User signed out, navigating to login...`

### 2. Test Debug Tools
In development mode, use the debug tools in the profile screen:
- "Test Logout" button to test logout functionality
- "Check State" button to verify current app state

### 3. Manual Testing
1. Go to Profile screen
2. Tap "Sign Out" button
3. Confirm logout in alert dialog
4. Check if navigation to login screen occurs
5. Verify user is actually logged out

### 4. Browser Testing
1. Clear browser cache and cookies
2. Try logging out again
3. Check if user stays logged out after page refresh

## Recent Fixes Applied

### 1. Improved signOut Function (`hooks/useAuth.ts`)
- Added immediate user state clearing
- Better error handling
- Force state updates even if Firebase fails

### 2. Enhanced Logout Handler (`app/(tabs)/profile.tsx`)
- Simplified async handling
- Better error messages
- Added debug logging

### 3. Improved Navigation (`app/_layout.tsx`)
- Added delay to ensure state updates complete
- Better logout detection
- Improved navigation timing

### 4. Enhanced Firebase Setup (`lib/firebase.ts`)
- Added auth state change listener for debugging
- Better persistence error handling
- More robust initialization

## Testing Checklist

- [ ] Logout button is visible and clickable
- [ ] Confirmation dialog appears
- [ ] Firebase sign out completes successfully
- [ ] User state is cleared immediately
- [ ] Navigation to login screen occurs
- [ ] User cannot access protected screens after logout
- [ ] Login works properly after logout
- [ ] No console errors during logout process

## Common Issues and Solutions

### Issue: User stays logged in after logout
**Solution**: Clear browser cache and cookies, check Firebase persistence settings

### Issue: Navigation doesn't occur after logout
**Solution**: Check auth state change listeners, verify navigation logic

### Issue: Error messages during logout
**Solution**: Check Firebase configuration, verify network connectivity

### Issue: Debug tools not showing
**Solution**: Ensure app is running in development mode (`__DEV__` is true)

## Next Steps

1. Test the logout functionality with the improved code
2. Check console logs for any remaining issues
3. Use debug tools to identify specific problems
4. Report any persistent issues with specific error messages

## Contact

If issues persist, please provide:
- Console log output during logout
- Steps to reproduce the issue
- Browser/device information
- Any error messages displayed
