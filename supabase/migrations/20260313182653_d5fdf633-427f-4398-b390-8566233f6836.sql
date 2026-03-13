UPDATE blog_posts
SET body = regexp_replace(
  body,
  'You can watch episodes of Life with DLD: The Dan and Daria Podcast on YouTube and explore the \[Living Life with DLD book series\]\(/books\) for more stories that help children understand their language and communication differences\.',
  'You can [watch episodes of Life with DLD: The Dan and Daria Podcast on YouTube](https://www.youtube.com/watch?v=FEA22DA7yn0&list=PLzfiOYFA1If6abH3LUNdxKPOAuOgkjZN5) and explore the [Living Life with DLD book series](https://mybook.to/nwINcA) for more stories that help children understand their language and communication differences.'
)
WHERE slug = 'life-with-dld-dan-daria-podcast';