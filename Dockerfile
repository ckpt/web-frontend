FROM nginx
WORKDIR /usr/share/nginx/html
COPY images images
COPY dist dist
COPY js/bundle.min.js js/bundle.min.js
COPY index.prod.html index.html


