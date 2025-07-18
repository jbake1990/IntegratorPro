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
   - **Build Command**: `npm run install-all && npm run build`
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

## Troubleshooting Build Errors

### Common Build Issues and Solutions

1. **TypeScript Compilation Errors**
   - **Issue**: TypeScript errors during build
   - **Solution**: Ensure all dependencies are properly installed
   ```bash
   npm run install-all
   ```

2. **Missing Dependencies**
   - **Issue**: Module not found errors
   - **Solution**: Check that all package.json files have correct dependencies
   - **Verify**: Run `npm ls` in each directory to check for missing packages

3. **Build Command Failures**
   - **Issue**: Build script fails
   - **Solution**: The build command should be: `npm run install-all && npm run build`
   - **Verify**: Test locally with `npm run build`

4. **Output Directory Issues**
   - **Issue**: Build artifacts not found
   - **Solution**: Ensure output directory is set to `client/build`
   - **Verify**: Check that `client/build` directory exists after build

5. **API Function Errors**
   - **Issue**: Serverless function deployment fails
   - **Solution**: The API is now configured as `api/server.ts`
   - **Verify**: Check that the API function compiles correctly

### Debugging Steps

1. **Check Build Logs**
   - Go to Vercel dashboard → Deployments
   - Click on the failed deployment
   - Review the build logs for specific error messages

2. **Test Locally**
   ```bash
   # Install all dependencies
   npm run install-all
   
   # Test the build process
   npm run build
   
   # Test the client build
   cd client && npm run build
   
   # Test the server build
   cd ../server && npm run build
   ```

3. **Verify Dependencies**
   ```bash
   # Check root dependencies
   npm ls
   
   # Check client dependencies
   cd client && npm ls
   
   # Check server dependencies
   cd ../server && npm ls
   
   # Check API dependencies
   cd ../api && npm ls
   ```

4. **Common Fixes**

   **If you get TypeScript errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   rm -rf client/node_modules client/package-lock.json
   rm -rf server/node_modules server/package-lock.json
   rm -rf api/node_modules api/package-lock.json
   npm run install-all
   ```

   **If you get module resolution errors:**
   - Check that all import paths are correct
   - Verify that TypeScript configuration is properly set up
   - Ensure that all dependencies are listed in package.json files

   **If the build times out:**
   - Increase the build timeout in Vercel settings
   - Optimize the build process by removing unnecessary dependencies
   - Consider using Vercel's build cache

### Environment-Specific Issues

1. **Development vs Production**
   - Ensure `NODE_ENV=production` is set in Vercel
   - Check that production builds are configured correctly
   - Verify that environment variables are properly set

2. **Database Connection**
   - Ensure `DATABASE_URL` is correctly formatted
   - Check that the database is accessible from Vercel's servers
   - Verify that SSL is properly configured for production

3. **API Routes**
   - The API is now served from `/api/*` routes
   - Frontend should use relative URLs for API calls
   - Check that CORS is properly configured

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
5. Test the build process locally before deploying

## Next Steps

After successful deployment:

1. **Set up monitoring and analytics**
2. **Configure backup strategies**
3. **Set up CI/CD for automatic deployments**
4. **Consider implementing additional security measures**
5. **Plan for scaling as your business grows**

Your Integrator Pro application should now be live and accessible at your Vercel URL! 