export const config = {
    brand: {
        name: "Delta Wiki",
        tagline: "The Unofficial Wiki for Delta Chat.",
        description: "An independent documentation effort by themadorg. Not affiliated with the official Delta Chat project.",
        logoText: "Delta Wiki"
    },
    socials: {
        github: "https://github.com/themadorg",
        twitter: "https://twitter.com/themadorg",
        forum: "https://support.delta.chat",
        email: "contact@themad.org"
    },
    footer: {
        sections: [
            {
                titleKey: "footer_section_docs",
                links: [
                    { labelKey: "footer_link_intro", href: "/docs/general/introduction" },
                    { labelKey: "footer_link_features", href: "/docs/general/features" }
                ]
            },
            {
                titleKey: "footer_section_community",
                links: [
                    { label: "Delta Chat Blog", href: "https://delta.chat/en/blog", external: true },
                    { label: "Support Forum", href: "https://support.delta.chat", external: true },
                    { label: "Twitter / X", href: "https://twitter.com/deltachat", external: true }
                ]
            },
            {
                titleKey: "footer_section_about",
                links: [
                    { label: "About Delta Chat", href: "https://delta.chat/en/about", external: true },
                    { label: "Privacy Policy", href: "https://delta.chat/en/privacy", external: true },
                    { label: "Contact", href: "https://delta.chat/en/contact", external: true }
                ]
            }
        ],
        bottomLinks: [
            { label: "Terms of Service", href: "https://delta.chat/en/gdpr", external: true },
            { label: "Privacy Policy", href: "https://delta.chat/en/gdpr", external: true }
        ]
    },
    downloadUrl: "https://delta.chat/en/download"
};
