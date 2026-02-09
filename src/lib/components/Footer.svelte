<script lang="ts">
    import { getI18n } from "$lib/i18n.svelte";
    import {
        Github,
        Twitter,
        MessageCircle,
        Mail,
        ExternalLink,
    } from "@lucide/svelte";

    import { config } from "../../config";
    import Logo from "./Logo.svelte";

    const i18n = getI18n();
    const currentYear = new Date().getFullYear();

    interface FooterLink {
        label: string;
        href: string;
        external: boolean;
    }

    interface FooterSection {
        title: string;
        links: FooterLink[];
    }

    const footerSections = $derived<FooterSection[]>(
        config.footer.sections.map((section) => ({
            title: section.titleKey
                ? i18n.t(section.titleKey)
                : (section as any).title,
            links: section.links.map((link) => ({
                label: (link as any).labelKey
                    ? i18n.t((link as any).labelKey)
                    : (link as any).label,
                href: (link as any).href,
                external: !!(link as any).external,
            })),
        })),
    );
</script>

<footer class="main-footer">
    <div class="footer-container">
        <div class="footer-grid">
            <div class="footer-brand">
                <div class="brand-logo">
                    <Logo size={38} class="footer-logo-img" />
                    <span class="logo-text">{i18n.t("brand_logo_text")}</span>
                </div>
                <p class="brand-description">
                    {config.brand.description}
                </p>

                <div class="social-links">
                    <a href={config.socials.github} aria-label="Github">
                        <Github size={20} />
                    </a>
                    <a href={config.socials.twitter} aria-label="Twitter">
                        <Twitter size={20} />
                    </a>
                    <a href={config.socials.forum} aria-label="Community">
                        <MessageCircle size={20} />
                    </a>
                    <a href="mailto:{config.socials.email}" aria-label="Email">
                        <Mail size={20} />
                    </a>
                </div>
            </div>

            {#each footerSections as section}
                <div class="footer-column">
                    <h4 class="column-title">{section.title}</h4>
                    <ul class="column-links">
                        {#each section.links as link}
                            <li>
                                <a
                                    href={link.href}
                                    target={link.external ? "_blank" : "_self"}
                                    rel={link.external
                                        ? "noopener noreferrer"
                                        : ""}
                                >
                                    {link.label}
                                    {#if link.external}
                                        <ExternalLink
                                            size={12}
                                            class="external-icon"
                                        />
                                    {/if}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>

        <div class="footer-bottom">
            <div class="copyright">
                © {currentYear}
                {i18n.t("brand_name")}. Independent Wiki.
            </div>
            <div class="bottom-links">
                {#each config.footer.bottomLinks as link}
                    <a href={link.href}>{link.label}</a>
                {/each}
            </div>
        </div>
    </div>
</footer>

<style>
    .main-footer {
        background: var(--bg-sidebar);
        border-top: 1px solid var(--border);
        padding: 4rem 2rem 2rem;
        margin-top: 4rem;
        color: var(--text);
    }

    .footer-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .footer-grid {
        display: grid;
        grid-template-columns: 1.5fr repeat(3, 1fr);
        gap: 4rem;
        margin-bottom: 4rem;
    }

    .footer-brand {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .brand-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
    }

    :global(.footer-logo-img) {
        width: 38px;
        height: 38px;
        color: var(--primary);
    }

    .disclaimer-text {
        font-size: 0.8125rem;
        color: var(--text-muted);
        line-height: 1.5;
        max-width: 320px;
        font-style: italic;
        opacity: 0.8;
    }

    .brand-description {
        color: var(--text-muted);
        font-size: 0.9375rem;
        line-height: 1.6;
        max-width: 300px;
    }

    .social-links {
        display: flex;
        gap: 1.25rem;
    }

    .social-links a {
        color: var(--text-muted);
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: var(--primary);
    }

    .column-title {
        font-size: 0.875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.5rem;
        color: var(--text);
        opacity: 0.9;
    }

    .column-links {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .column-links a {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 1rem;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .column-links a:hover {
        color: var(--primary);
        transform: translateX(4px);
    }

    :global(.external-icon) {
        opacity: 0.5;
    }

    .footer-bottom {
        border-top: 1px solid var(--border);
        padding-top: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .bottom-links {
        display: flex;
        gap: 2rem;
    }

    .bottom-links a {
        color: var(--text-muted);
        text-decoration: none;
        transition: color 0.2s;
    }

    .bottom-links a:hover {
        color: var(--text);
    }

    @media (max-width: 1024px) {
        .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
        }
    }

    @media (max-width: 640px) {
        .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
        }

        .footer-bottom {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
        }

        .bottom-links {
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>
