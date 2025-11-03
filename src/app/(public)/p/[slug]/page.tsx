import { getProductBySlug } from "@/features/products/model";
import AddToCartForm from "./add-to-cart-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IProps {
	params: {
		slug: string;
	};
}
export default async function DetailProduct(props: IProps) {
  // Lấy ra params trước
  const params = await props.params  // ← chú ý: giờ bắt buộc await
  const slug = params.slug

  const session = await getServerSession(authOptions)
  const productDetail = await getProductBySlug(slug)

 console.log('DATA PRODUCT:', productDetail)
	return (
		<div className="bg-white">
			<div className="pt-6">
				<nav aria-label="Breadcrumb">
					<ol
						role="list"
						className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
					>
						{(productDetail?.categories || []).map((categorie) => (
							<li key={categorie.id}>
								<div className="flex items-center">
									<a
										href={categorie.slug}
										className="mr-2 text-sm font-medium text-gray-900"
									>
										{categorie.name}
									</a>
									<svg
										fill="currentColor"
										width={16}
										height={20}
										viewBox="0 0 16 20"
										aria-hidden="true"
										className="h-5 w-4 text-gray-300"
									>
										<path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
									</svg>
								</div>
							</li>
						))}
						<li className="text-sm">{productDetail?.name}</li>
					</ol>
				</nav>

				{/* Image gallery */}
				<div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
					{productDetail?.images?.slice(0, 3).map((image, i) => (
						<div
							key={i}
							className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block"
						>
							<img
								src={image || ""}
								alt={productDetail?.name}
								className="h-full w-full object-cover object-center"
							/>
						</div>
					))}
				</div>

				{/* Product info */}
				<div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
					<div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
							{productDetail?.name}
						</h1>
					</div>

					{/* Options */}
					<div className="mt-4 lg:row-span-3 lg:mt-0">
						<h2 className="sr-only">Product information</h2>
						<p className="text-3xl tracking-tight text-gray-900">
							{productDetail?.defaultPrice}
						</p>

						<AddToCartForm
							properties={productDetail?.properties || []}
							id={productDetail?.id || ""}
							uuid={session?.user.id}
						/>
					</div>

					<div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
						{/* Description and details */}
						<div>
							<h3 className="sr-only">Description</h3>

							<article
								className="prose space-y-6"
								dangerouslySetInnerHTML={{
									__html: productDetail?.description || "",
								}}
							></article>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}