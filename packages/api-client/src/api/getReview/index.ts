// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getReview(context, params) {
  const url = new URL(context.config.api.url + '/rest/listcomments');
  params.productId && url.searchParams.set('id_product', params.productId);
  params.productId && url.searchParams.set('page', params.page);

  const { data } = await context.client.get(url.href);
  return data;
}
