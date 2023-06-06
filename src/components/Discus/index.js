import React, { useEffect } from 'react';

export default function Discus({ identifier, title, url }) {
    useEffect(() => {
        // Configuração do Disqus
        window.disqus_config = function () {
            this.page.url = url;
            this.page.identifier = identifier;
            this.page.title = title;
        };

        // Carrega o script do Disqus
        const script = document.createElement('script');
        script.src = 'https://gon-tv.disqus.com/embed.js';
        script.setAttribute('data-timestamp', +new Date());
        document.head.appendChild(script);



        return () => {
            // Limpa o conteúdo do Disqus ao desmontar o componente
            const disqusThread = document.getElementById('disqus_thread');
            if (disqusThread) {
                disqusThread.innerHTML = '';
            }
        };
    }, [identifier, title, url]);

    return <div id="disqus_thread"></div>;
}

