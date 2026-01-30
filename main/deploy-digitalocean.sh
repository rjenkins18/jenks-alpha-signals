#!/bin/bash
# DigitalOcean deployment script for Jenks Alpha Signals
echo "🚀 Deploying to DigitalOcean Premium Hosting..."

# Install Nginx if not present
sudo apt update
sudo apt install -y nginx

# Create website directory
sudo mkdir -p /var/www/jenksalpha.crypto

# Copy website files
sudo cp -r * /var/www/jenksalpha.crypto/

# Configure Nginx
sudo tee /etc/nginx/sites-available/jenksalpha.crypto > /dev/null <<EOF
server {
    listen 80;
    server_name jenksalpha.crypto www.jenksalpha.crypto;
    root /var/www/jenksalpha.crypto;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/jenksalpha.crypto /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Install SSL certificate
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jenksalpha.crypto -d www.jenksalpha.crypto --non-interactive --agree-tos --email admin@jenksalpha.crypto

echo "✅ Deployment complete! Site live at https://jenksalpha.crypto"
