# Deploy Dream Interpretation Edge Function

## Prerequisites
1. Supabase CLI installed
2. Logged into Supabase CLI
3. Project linked to your Supabase project

## Steps to Deploy

### 1. Navigate to your project directory
```bash
cd /path/to/your/project
```

### 2. Deploy the Edge Function
```bash
supabase functions deploy interpret-dream
```

### 3. Set the Environment Variable
```bash
supabase secrets set DEEP_SEEK_API=your_deepseek_api_key_here
```

### 4. Verify Deployment
```bash
supabase functions list
```

## Testing the Function

### Test locally (optional)
```bash
supabase functions serve interpret-dream --env-file .env.local
```

### Test the deployed function
```bash
curl -X POST https://rlzngxvmqcufzgxwdnyg.supabase.co/functions/v1/interpret-dream \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "dreamTitle": "Test Dream",
    "dreamDescription": "I was flying over a beautiful landscape",
    "mood": "peaceful"
  }'
```

## Function URL
Your function will be available at:
`https://rlzngxvmqcufzgxwdnyg.supabase.co/functions/v1/interpret-dream`

## Troubleshooting

### Check function logs
```bash
supabase functions logs interpret-dream
```

### Check function status
```bash
supabase functions list
```

### Redeploy if needed
```bash
supabase functions deploy interpret-dream --no-verify-jwt
```

## Security Notes
- The function uses JWT verification by default
- API key is stored securely in Supabase secrets
- CORS is configured for web access
- Input validation is implemented
