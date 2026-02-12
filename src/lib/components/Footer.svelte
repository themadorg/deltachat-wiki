<script lang="ts">
    import { getI18n } from "$lib/i18n.svelte";
    import { config } from "../../config";
    import Logo from "./Logo.svelte";
    import { Github, ExternalLink } from "@lucide/svelte";

    const i18n = getI18n();
</script>

<footer class="footer">
    <div class="footer-container">
        <div class="footer-main">
            <div class="brand-section">
                <a href="/{i18n.lang}" class="footer-logo">
                    <Logo size={28} />
                    <span class="logo-text">{i18n.t("brand_logo_text")}</span>
                </a>
                <p class="brand-tagline">
                    {i18n.t("hero_subtitle")}
                </p>
                <div class="social-links">
                    {#if config.socials.github}
                        <a
                            href={config.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="social-link"
                            title="GitHub"
                        >
                            <Github size={20} />
                        </a>
                    {/if}
                </div>
            </div>

            <nav class="footer-nav">
                {#each config.footer.sections as section}
                    <div class="footer-section">
                        <h4>{i18n.t(section.titleKey)}</h4>
                        <ul>
                            {#each section.links as link}
                                <li>
                                    <a
                                        href={link.href}
                                        target={link.external
                                            ? "_blank"
                                            : undefined}
                                        rel={link.external
                                            ? "noopener noreferrer"
                                            : undefined}
                                    >
                                        {i18n.t(link.labelKey)}
                                        {#if link.external}
                                            <ExternalLink
                                                size={12}
                                                class="ext-icon"
                                            />
                                        {/if}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </nav>
        </div>

        <div class="footer-bottom">
            <div class="footer-info">
                <div class="copyright">
                    © {new Date().getFullYear()}
                    {i18n.t("brand_name")}.
                    <a
                        href={config.wiki.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="wiki-link"
                    >
                        GitHub
                    </a>
                </div>
                <div class="license">
                    {i18n.t("footer_license")}
                </div>
            </div>
        </div>
    </div>
</footer>

<style>
    .footer {
        background: var(--bg-surface);
        border-top: 1px solid var(--border);
        padding: 5rem 2rem 3rem;
        margin-top: auto;
        position: relative;
        z-index: 2;
    }

    .footer-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .footer-main {
        display: grid;
        grid-template-columns: 1.5fr 3fr;
        gap: 4rem;
        margin-bottom: 4rem;
    }

    .brand-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: var(--text);
        font-weight: 800;
        font-size: 1.25rem;
    }

    .brand-tagline {
        color: var(--text-muted);
        font-size: 0.9375rem;
        line-height: 1.6;
        max-width: 300px;
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-link {
        color: var(--text-muted);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(120, 120, 120, 0.05);
    }

    .social-link:hover {
        color: var(--primary);
        background: rgba(var(--primary-rgb), 0.1);
        transform: translateY(-2px);
    }

    .footer-nav {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }

    .footer-section h4 {
        font-size: 0.875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.5rem;
        color: var(--text);
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .footer-section a {
        text-decoration: none;
        color: var(--text-muted);
        font-size: 0.9375rem;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .footer-section a:hover {
        color: var(--text);
    }

    :global(.ext-icon) {
        opacity: 0.5;
    }

    .footer-bottom {
        border-top: 1px solid var(--border);
        padding-top: 2rem;
    }

    .footer-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        text-align: center;
    }

    .copyright {
        color: var(--text-muted);
        font-size: 0.875rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .license {
        font-size: 0.8125rem;
        color: var(--text-muted);
        opacity: 0.7;
    }

    .wiki-link {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
    }

    .wiki-link:hover {
        text-decoration: underline;
    }

    @media (max-width: 900px) {
        .footer-main {
            grid-template-columns: 1fr;
            gap: 4rem;
        }

        .footer-nav {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .footer-nav {
            grid-template-columns: 1fr;
        }
    }
</style>
