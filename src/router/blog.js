const handleBlogRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  req.path = url.split('?')[0]

  if (method)
}