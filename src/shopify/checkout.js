// This is an archive of the JS we inject into the checkout page
// It is actually edited within the Shopify UI
{% if first_time_accessed %}

<script>
if ("{{ order.line_items[0].sku }}" === "PREORDER"){
  let params = new URLSearchParams({
    "flow": "order",
    "step": "thanks",
    "qty": "{{ order.line_items[0].quantity }}",
    "orderId": "{{ order.id }}",
    "verification": "{{ order.id | hmac_sha256: "SECRET_REDACTED" }}",
    "value": "{{ checkout.subtotal_price }}",
  })

  document.location = "https://sendheirloom.com?" + params.toString()
}
</script>

<script>
let url = `https://create.sendheirloom.com/thank-you?id=${Shopify.checkout.order_id}`;
let web_attr = {{ order.attributes | json }};
if (web_attr.VideoManifest) {
    location.href=url;
}
</script>

{% endif %}
