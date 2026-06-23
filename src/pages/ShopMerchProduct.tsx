import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MerchProductDetail from "@/components/merch/MerchProductDetail";
import MerchCartDrawer from "@/components/merch/MerchCartDrawer";
import MerchCartButton from "@/components/merch/MerchCartButton";
import { MerchCartProvider } from "@/contexts/MerchCartContext";
import { findMerchProduct } from "@/data/merchPlaceholders";

const ShopMerchProduct = () => {
  const { handle } = useParams();
  const product = handle ? findMerchProduct(handle) : undefined;

  if (!product) return <Navigate to="/shop/merch" replace />;

  return (
    <MerchCartProvider>
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title={`${product.title} | Empowered DLD Merch`}
          description={product.tagline}
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
    </MerchCartProvider>
  );
};

export default ShopMerchProduct;
