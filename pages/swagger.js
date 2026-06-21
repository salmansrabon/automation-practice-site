import Head from 'next/head';
import Script from 'next/script';

export default function SwaggerPage() {
  return (
    <>
      <Head>
        <title>API Documentation</title>
        <link rel="stylesheet" type="text/css" href="/api/swagger-ui/swagger-ui.css" />
      </Head>

      <div id="swagger-ui" />

      <Script src="/api/swagger-ui/swagger-ui-bundle.js" strategy="afterInteractive" />
      <Script src="/api/swagger-ui/swagger-ui-standalone-preset.js" strategy="afterInteractive" />
      <Script id="swagger-init" strategy="afterInteractive">{`
        (function init() {
          if (typeof window.SwaggerUIBundle === 'undefined') {
            setTimeout(init, 50);
            return;
          }
          window.SwaggerUIBundle({
            url: '/api/swagger-spec',
            dom_id: '#swagger-ui',
            presets: [
              window.SwaggerUIBundle.presets.apis,
              window.SwaggerUIStandalonePreset
            ],
            layout: 'StandaloneLayout',
            tryItOutEnabled: true,
            persistAuthorization: true
          });
        })();
      `}</Script>
    </>
  );
}
