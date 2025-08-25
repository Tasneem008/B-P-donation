// controllers/aboutUs.controller.js

// Render the About Us page
exports.getAboutUsPage = (req, res) => {
  try {
    return res.render("aboutUs", {
      title: "About Us - DonateLife",
    });
  } catch (error) {
    console.error("Error rendering About Us page:", error);
    return res.status(500).send("Something went wrong!");
  }
};
