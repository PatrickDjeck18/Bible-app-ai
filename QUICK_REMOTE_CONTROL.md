# 🎯 Quick Remote Control Reference

## 🚀 **Your Control Center**
- **Website**: https://daily-bread-88f42.web.app
- **Config File**: https://daily-bread-88f42.web.app/ad-config.json
- **Firebase Console**: https://console.firebase.google.com/project/daily-bread-88f42/hosting

## ⚡ **Quick Commands**

### **Deploy Changes**
```bash
firebase deploy --only hosting
```

### **Emergency Stop (Disable All Ads)**
Edit `public/ad-config.json`:
```json
{
  "adsEnabled": false,
  "bannerAdsEnabled": false,
  "interstitialAdsEnabled": false,
  "rewardedAdsEnabled": false
}
```

### **Enable Test Mode**
```json
{
  "testModeEnabled": true,
  "debugLoggingEnabled": true
}
```

### **Conservative Ads (Launch)**
```json
{
  "bannerFrequency": 10,
  "interstitialFrequency": 20,
  "rewardedFrequency": 25
}
```

### **Aggressive Ads (Monetization)**
```json
{
  "bannerFrequency": 3,
  "interstitialFrequency": 8,
  "rewardedFrequency": 12
}
```

## 📱 **Test in App**
1. Open your app
2. Go to Profile → Ad Testing
3. Check "Remote Config Status"
4. Verify changes are loaded

## 🔧 **Troubleshooting**
- **Changes not showing?** Wait 5 minutes for cache refresh
- **Deploy failed?** Run `firebase use` to check project
- **App not loading config?** Check internet connection

## 📞 **Need Help?**
- Check the full guide: `REMOTE_CONTROL_GUIDE.md`
- Test in app: Profile → Ad Testing
- Firebase Console: Monitor deployments
