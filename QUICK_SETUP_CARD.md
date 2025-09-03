# 🚀 Quick Firebase Remote Config Setup Card

## **Essential Parameters (Start with these 10)**

| Parameter Key | Default Value | Type | Description |
|---------------|---------------|------|-------------|
| `ads_enabled` | `true` | Boolean | Master switch for all ads |
| `banner_ads_enabled` | `true` | Boolean | Enable/disable banner ads |
| `interstitial_ads_enabled` | `true` | Boolean | Enable/disable interstitial ads |
| `rewarded_ads_enabled` | `true` | Boolean | Enable/disable rewarded ads |
| `banner_ad_unit_id` | `ca-app-pub-3940256099942544/6300978111` | String | Banner ad unit ID |
| `interstitial_ad_unit_id` | `ca-app-pub-3940256099942544/1033173712` | String | Interstitial ad unit ID |
| `rewarded_ad_unit_id` | `ca-app-pub-3940256099942544/5224354917` | String | Rewarded ad unit ID |
| `interstitial_frequency` | `3` | Number | Show interstitial every Nth time |
| `rewarded_frequency` | `5` | Number | Show rewarded ad every Nth time |
| `test_mode_enabled` | `false` | Boolean | Enable test mode for development |

## **Quick Setup Steps**

1. **Go to**: https://console.firebase.google.com/
2. **Select your project**
3. **Navigate to Remote Config**
4. **Click "Get Started"**
5. **Add the 10 parameters above**
6. **Click "Publish Changes"**
7. **Add description**: "Initial AdMob configuration"
8. **Click "Publish"**

## **Test Your Setup**

1. **Open your app**
2. **Go to the diagnostic tool** on the home screen
3. **Check if Remote Config is working**

## **Quick Commands**

- **Disable all ads**: Set `ads_enabled` to `false`
- **Change ad frequency**: Set `interstitial_frequency` to `5`
- **Enable test mode**: Set `test_mode_enabled` to `true`

## **Need Help?**

- Check the full guide: `FIREBASE_SETUP_GUIDE.md`
- Use the CSV file: `remote-config-parameters.csv`
- Run the setup script: `node setup-remote-config.js instructions`
