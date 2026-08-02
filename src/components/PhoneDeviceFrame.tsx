type PhoneDeviceFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

export function PhoneDeviceFrame({ src, alt, className = '' }: PhoneDeviceFrameProps) {
  return (
    <figure className={`phone-device ${className}`.trim()} aria-label={alt}>
      <div className="phone-device__screen">
        <div className="phone-device__island" aria-hidden="true" />
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className="phone-device__bar" aria-hidden="true" />
    </figure>
  );
}
