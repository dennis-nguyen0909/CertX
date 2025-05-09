import initTranslations from "@/libs/i18n";
import TranslationsProvider from "@/components/translations-provider";
import { AuthProvider } from "@/contexts/auth";
import { WalletProvider } from "@/contexts/wallet";
import ServicesProvider from "@/services";
import QueryClientProvider from "@/components/query-client-provider";

export default async function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { resources } = await initTranslations(locale);

  return (
    <QueryClientProvider>
      <AuthProvider>
        <WalletProvider>
          <ServicesProvider>
            <TranslationsProvider locale={locale} resources={resources}>
              {children}
            </TranslationsProvider>
          </ServicesProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
