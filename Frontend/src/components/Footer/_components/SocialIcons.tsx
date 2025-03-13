import { FaInstagram } from "react-icons/fa";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

type SocialIconsProps = {
  size?: number;
  className?: string;
};

const SocialIcons = ({ size = 36, className = "" }: SocialIconsProps) => {
  const socialIcons = [
    { icon: FaInstagram, name: "Instagram", url: "/" },
    { icon: FaFacebook, name: "Facebook", url: "/" },
    { icon: FaXTwitter, name: "X (Twitter)", url: "/" },
  ];

  return (
    <div className={`flex gap-6 ${className}`}>
      {socialIcons.map((social) => (
        <Link
          key={social.name}
          to={social.url}
          className="hover:text-white/80 transition-colors cursor-pointer"
          aria-label={`Visitez notre page ${social.name}`}
        >
          <social.icon size={size} />
        </Link>
      ))}
      <span className="sr-only">Nos réseaux sociaux</span>
    </div>
  );
};

export default SocialIcons;
