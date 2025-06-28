# Vercel Deployment Guide for Integrator Pro

This guide will walk you through deploying your Integrator Pro application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to [https://github.com/jbake1990/IntegratorPro.git](https://github.com/jbake1990/IntegratorPro.git)
3. **Database**: You'll need a PostgreSQL database (we recommend using [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech))

## Step 1: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to "Storage" → "Create Database"
3. Choose "Postgres"
4. Select your project and region
5. Note down the connection string

### Option B: Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Import Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `jbake1990/IntegratorPro`
   - Select the repository and click "Deploy"

2. **Configure Project Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm run install-all`

3. **Environment Variables**
   Add the following environment variables in Vercel:
   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=production
   CLIENT_URL=https://your-app-name.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project: No
   - Project name: integrator-pro
   - Directory: ./
   - Override settings: No

## Step 3: Configure Database

After deployment, you need to set up your database:

1. **Access Vercel Functions**
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to "Functions" tab

2. **Run Database Setup**
   - Use Vercel's function logs or connect to your database directly
   - Run the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Step 4: Update Configuration

### Update API Base URL

The frontend is configured to use relative URLs in production, so it should work automatically with Vercel's routing.

### Environment Variables

Make sure these are set in your Vercel project settings:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
CLIENT_URL=https://your-app-name.vercel.app
```

## Step 5: Test Your Deployment

1. **Visit your app**: `https://your-app-name.vercel.app`
2. **Test login**: Use the default admin credentials:
   - Email: `admin@integratorpro.com`
   - Password: `admin123`

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly installed
   - Verify TypeScript compilation

2. **Database Connection Issues**
   - Verify your DATABASE_URL is correct
   - Check if your database allows external connections
   - Ensure the database exists and is accessible

3. **API Routes Not Working**
   - Check that the vercel.json configuration is correct
   - Verify the API routes are properly configured
   - Check function logs in Vercel dashboard

4. **CORS Issues**
   - The application is configured to handle CORS automatically
   - If issues persist, check the CLIENT_URL environment variable

### Debugging

1. **Check Function Logs**
   - Go to Vercel dashboard → Functions
   - Click on any function to see logs

2. **Check Build Logs**
   - Go to Vercel dashboard → Deployments
   - Click on a deployment to see build logs

3. **Database Issues**
   - Use Prisma Studio: `npx prisma studio`
   - Check database connection directly

## Production Considerations

### Security

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Vercel's environment variable system
   - Rotate JWT secrets regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL for database connections
   - Regularly backup your database

### Performance

1. **Caching**
   - Vercel automatically caches static assets
   - Consider implementing API response caching

2. **Database Optimization**
   - Add database indexes for frequently queried fields
   - Monitor query performance

### Monitoring

1. **Vercel Analytics**
   - Enable Vercel Analytics for performance monitoring
   - Monitor function execution times

2. **Error Tracking**
   - Consider adding error tracking (Sentry, etc.)
   - Monitor API response times

## Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - No additional configuration needed

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [Prisma documentation](https://www.prisma.io/docs)
3. Check the function logs in your Vercel dashboard
4. Verify your environment variables are correctly set

## Next Steps

After successful deployment:

1. **Set up monitoring and analytics**
2. **Configure backup strategies**
3. **Set up CI/CD for automatic deployments**
4. **Consider implementing additional security measures**
5. **Plan for scaling as your business grows**

Your Integrator Pro application should now be live and accessible at your Vercel URL! 