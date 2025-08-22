// controllers/aboutUs.controller.js

// Render the About Us page
exports.getAboutUsPage = (req, res) => {
  try {
    res.render("aboutUs", {
      title: "About Us - DonateLife",
    });
  } catch (error) {
    console.error("Error rendering About Us page:", error);
    res.status(500).send("Something went wrong!");
  }
};
