import { appMetadataConfig } from '@/config/app-metadata.config';
import type { Metadata } from 'next';

type IMetaProfile = {
  name: string;
  description?: string;
  image?: string;
  url: string;
};

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  metaProfile?: IMetaProfile;
};

const basePath = process.env.APP_URL;

export async function generateMetadata(props: IMetaProps): Promise<Metadata> {
  return {
    title: props.title,
    appLinks: {},
    icons: [
      `${basePath}/apple-touch-icon.png`,
      `${basePath}/favicon-32x32.png`,
      `${basePath}/favicon-16x16.png`,
      `${basePath}/favicon.ico`,
    ],
    description: props.description,
    openGraph: {
      title: props?.metaProfile ? props.metaProfile.name : props.title,
      description: props?.metaProfile ? props.metaProfile.description : props.description,
      url: props?.metaProfile?.url ? props.metaProfile.url : props.canonical,
      locale: appMetadataConfig.locale,
      type: props?.metaProfile ? 'profile' : 'website',
      images: [...(props?.metaProfile?.image ? [props?.metaProfile?.image] : [])],
    },
  };
}
