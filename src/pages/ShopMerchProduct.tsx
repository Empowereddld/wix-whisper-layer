import { useParams, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MerchProductDetail from "@/components/merch/MerchProductDetail";
import MerchCartDrawer from "@/components/merch/MerchCartDrawer";
import MerchCartButton from "@/components/merch/MerchCartButton";
import { useShopifyProduct } from "@/hooks/useShopifyProduct";
import { getMerchDisplayTitle } from "@/components/merch/MerchProductTitle";

const ShopMerchProduct = () => {
  const { handle } = useParams();
  const { data: product, isLoading, error } = useShopifyProduct(handle);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
        <MerchCartButton />
      </div>
    );
  }

  if (!product || error) return <Navigate to="/shop/merch" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${getMerchDisplayTitle(product.handle, product.title)} | Empowered DLD Merch`}
        description={product.description}
        path={`/shop/merch/${product.handle}`}
        noindex
      />
      <Header />
      <main className="flex-1">
        <MerchProductDetail product={product} />
      </main>
      <Footer />
      <MerchCartDrawer />
      <MerchCartButton />
    </div>
  );
};

export default ShopMerchProduct;
