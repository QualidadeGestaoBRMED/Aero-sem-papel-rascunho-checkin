import type { SVGProps } from "react";

/*
 * Conjunto de ícones próprio da Triagem.
 * Linguagem: grade 24px, traço 2, pontas arredondadas, motivos concêntricos
 * ecoando a marca (círculos + arcos). Sempre `currentColor`.
 */

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    />
  );
}

export function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </Svg>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="m5 12.8 4.3 4.3L19 7.4" />
    </Svg>
  );
}

export function IconSteps(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9.5 6.5h11M9.5 12h11M9.5 17.5h11" />
      <circle cx="4.6" cy="6.5" r="1.5" />
      <circle cx="4.6" cy="12" r="1.5" />
      <circle cx="4.6" cy="17.5" r="1.5" />
    </Svg>
  );
}

export function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8V12l2.8 1.8" />
    </Svg>
  );
}

export function IconCamera(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M4.5 8.5h3l1.4-2.2h6.2l1.4 2.2h3a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V10a1.5 1.5 0 0 1 1.5-1.5Z" />
      <circle cx="12" cy="13.4" r="3.3" />
    </Svg>
  );
}

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.6 15.6 4.4 4.4" />
    </Svg>
  );
}

export function IconUpload(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 16.5V4.8" />
      <path d="m7.8 9 4.2-4.2L16.2 9" />
      <path d="M4.5 15.5v2.6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.6" />
    </Svg>
  );
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M4.5 15.4 15.2 4.7a2.1 2.1 0 0 1 3 3L7.5 18.4l-4 1 1-4Z" />
    </Svg>
  );
}

export function IconFile(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M13.4 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.1Z" />
      <path d="M13.4 3.5v4.1a1.5 1.5 0 0 0 1.5 1.5H19" />
    </Svg>
  );
}

export function IconBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M5.5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14.5 5v15.5" />
      <path d="M14.5 10H18a1.5 1.5 0 0 1 1.5 1.5v9" />
      <path d="M3.5 20.5h17" />
      <path d="M8.6 7.6h2.8M8.6 11.4h2.8M8.6 15.2h2.8" />
    </Svg>
  );
}

export function IconBriefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="7.6" width="17" height="12" rx="2.2" />
      <path d="M9 7.6V6a1.8 1.8 0 0 1 1.8-1.8h2.4A1.8 1.8 0 0 1 15 6v1.6" />
      <path d="M3.5 12.4h17" />
    </Svg>
  );
}

export function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8.4" r="3.6" />
      <path d="M5.2 19.6c1-3.3 12.6-3.3 13.6 0" />
    </Svg>
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
    </Svg>
  );
}

export function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2.5" />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" />
      <path d="M12 14v2" />
    </Svg>
  );
}

export function IconAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.2v4.6" />
      <circle cx="12" cy="16.4" r="0.4" fill="currentColor" />
    </Svg>
  );
}

export function IconCheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.4 2.6 2.6 5-5.6" />
    </Svg>
  );
}

export function IconId(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.6" />
      <circle cx="8.7" cy="10.4" r="1.9" />
      <path d="M6 15.6c.6-1.6 4.8-1.6 5.4 0" />
      <path d="M14 9.6h4.5" />
      <path d="M14 13h4.5" />
    </Svg>
  );
}

export function IconCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="4" y="6" width="16" height="14.5" rx="2.6" />
      <path d="M8.5 3.8v4M15.5 3.8v4M4 11h16" />
    </Svg>
  );
}

export function IconAnchor(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5.8" r="2.1" />
      <path d="M12 7.9v12.6" />
      <path d="M4.5 12.7a7.5 7.5 0 0 0 15 0" />
      <path d="M4.5 12.7H7M17 12.7h2.5" />
    </Svg>
  );
}
