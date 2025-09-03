# 🎯 Remote Ad Control System - Complete Guide

## 🚀 **Your Remote Control is Now Live!**

Your Firebase Hosting is deployed at: **https://daily-bread-88f42.web.app**

### 📱 **How to Control Ads Remotely**

#### **1. Access Your Control Panel**
- Visit: https://daily-bread-88f42.web.app
- This shows your current ad configuration
- Click on `/ad-config.json` to view/edit the raw configuration

#### **2. Update Ad Settings**
Edit the `public/ad-config.json` file in your project, then redeploy:

```bash
# Make changes to public/ad-config.json
firebase deploy --only hosting
```

#### **3. Quick Commands for Common Changes**

**Disable All Ads:**
```json
{
  "adsEnabled": false,
  "bannerAdsEnabled": false,
  "interstitialAdsEnabled": false,
  "rewardedAdsEnabled": false
}
```

**Enable Only Banner Ads:**
```json
{
  "adsEnabled": true,
  "bannerAdsEnabled": true,
  "interstitialAdsEnabled": false,
  "rewardedAdsEnabled": false
}
```

**Set High Frequency Ads:**
```json
{
  "interstitialFrequency": 2,
  "bannerFrequency": 1,
  "rewardedFrequency": 3
}
```

**Enable Test Mode:**
```json
{
  "testModeEnabled": true,
  "debugLoggingEnabled": true
}
```

### 🎮 **Available Control Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `adsEnabled` | boolean | true | Master switch for all ads |
| `bannerAdsEnabled` | boolean | true | Enable/disable banner ads |
| `interstitialAdsEnabled` | boolean | true | Enable/disable interstitial ads |
| `rewardedAdsEnabled` | boolean | true | Enable/disable rewarded ads |
| `bannerAdUnitId` | string | test-id | Banner ad unit ID |
| `interstitialAdUnitId` | string | test-id | Interstitial ad unit ID |
| `rewardedAdUnitId` | string | test-id | Rewarded ad unit ID |
| `bannerFrequency` | number | 5 | Show banner every N screens |
| `interstitialFrequency` | number | 10 | Show interstitial every N screens |
| `rewardedFrequency` | number | 15 | Show rewarded every N actions |
| `testModeEnabled` | boolean | false | Use test ad IDs |
| `debugLoggingEnabled` | boolean | false | Enable debug logging |

### 🔄 **How It Works**

1. **Your App**: Fetches config from Firebase Hosting every 5 minutes
2. **Firebase Hosting**: Serves the JSON file from your `public/` folder
3. **Remote Control**: Update the JSON file and redeploy to change settings
4. **Instant Effect**: Changes take effect within 5 minutes without app updates!

### 📊 **Monitoring & Testing**

#### **In Your App:**
- Go to Profile → Ad Testing
- Check "Remote Config Status"
- View current ad settings
- Test ad display logic

#### **On Firebase Console:**
- Visit: https://console.firebase.google.com/project/daily-bread-88f42/hosting
- View deployment history
- Monitor traffic and performance

### 🛠 **Advanced Usage**

#### **Conditional Ad Display**
Your app automatically handles:
- ✅ User engagement-based frequency
- ✅ Time-based cooldowns
- ✅ Screen-specific targeting
- ✅ A/B testing support

#### **Emergency Controls**
For urgent situations, you can:
1. Set `adsEnabled: false` to disable all ads immediately
2. Set `testModeEnabled: true` to show only test ads
3. Adjust frequency to `999` to virtually disable specific ad types

### 🔧 **Troubleshooting**

#### **If Ads Don't Update:**
1. Check the app's "Ad Testing" screen
2. Verify the config URL is correct
3. Ensure Firebase Hosting is deployed
4. Wait up to 5 minutes for cache refresh

#### **If Firebase Deploy Fails:**
```bash
# Check Firebase status
firebase projects:list
firebase use

# Redeploy
firebase deploy --only hosting
```

### 📈 **Best Practices**

1. **Test Changes**: Always test in development first
2. **Gradual Rollout**: Change frequency gradually, not drastically
3. **Monitor Performance**: Watch user engagement after changes
4. **Backup Config**: Keep a backup of working configurations
5. **Document Changes**: Note what changes you make and why

### 🎯 **Quick Start Examples**

#### **Launch Day (Conservative):**
```json
{
  "adsEnabled": true,
  "bannerAdsEnabled": true,
  "interstitialAdsEnabled": false,
  "rewardedAdsEnabled": false,
  "bannerFrequency": 10,
  "testModeEnabled": false
}
```

#### **Growth Phase (Balanced):**
```json
{
  "adsEnabled": true,
  "bannerAdsEnabled": true,
  "interstitialAdsEnabled": true,
  "rewardedAdsEnabled": true,
  "bannerFrequency": 5,
  "interstitialFrequency": 15,
  "rewardedFrequency": 20
}
```

#### **Monetization Focus:**
```json
{
  "adsEnabled": true,
  "bannerAdsEnabled": true,
  "interstitialAdsEnabled": true,
  "rewardedAdsEnabled": true,
  "bannerFrequency": 3,
  "interstitialFrequency": 8,
  "rewardedFrequency": 12
}
```

---

## 🎉 **You're All Set!**

Your remote control system is now fully operational. You can control your app's ads from anywhere in the world by simply updating a JSON file and redeploying to Firebase Hosting.

**Next Steps:**
1. Test the system by making a small change
2. Set up your production ad unit IDs
3. Monitor user engagement
4. Optimize based on performance data

**Need Help?**
- Check the "Ad Testing" screen in your app
- Review this guide
- Check Firebase Console for deployment status
