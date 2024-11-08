import "./style.css";
import React from "react";

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en" data-bs-theme="dark">
    <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta property="description"
              content="Besoin de trier les vidéos de la playlist ? Vidéo-Versus est là pour toi !"/>
        <meta property="og:site_name" content="Vidéo-Versus"/>
        <meta property="og:title" content="Vidéo-Versus, ton appli de tri de playlist"/>
        <link href={"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"} rel="stylesheet"
              integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
              crossOrigin="anonymous"/>
        <link rel="icon"
              href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎉</text></svg>"/>
        <title>Video Versus</title>
    </head>
    <body>
    {children}
    </body>
    </html>);
}
