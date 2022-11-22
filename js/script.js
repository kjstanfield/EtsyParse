let decals = {};
let bookmarks = {};
let cups = {};

$(document).ready(function () {
  $("#file-input").change(function () {
    // Clear Console
    console.clear();
    let file = document.getElementById("file-input").files[0];
    Papa.parse(file, {
      header: true,
      complete: function (result) {
        console.log(result.data);

        result.data.forEach((item, index) => {
          // Check Decals that haven't shipped yet
          if (
            item["Date Shipped"] == "" &&
            item["Item Name"].toLowerCase().includes("decal")
          ) {
            decal_checker(item["Item Name"], item["Variations"]);
          }

          // Check Bookmarks that haven't shipped yet
          if (
            item["Date Shipped"] == "" &&
            item["Item Name"].toLowerCase().includes("bookmark")
          ) {
            bookmark_checker(item["Item Name"], item["Variations"]);
          }

          // Check Cups that haven't shipped yet
          if (
            item["Date Shipped"] == "" &&
            item["Item Name"].toLowerCase().includes("glass")
          ) {
            cup_checker(item["Item Name"], item["Variations"]);
          }
        });
        console.log("Decals", decals);
        //Render Decals
        Object.entries(sort_object(decals)).forEach((decal) => {
          const [key, value] = decal;
          let dsplit = key.split("_");
          let dname = dsplit[0];
          let dcolor = dsplit[1];
          let dsize = dsplit[2];
          $("#decals").append(`
          <tr>
            <td scope="row">${dname}</td>
            <td>${dcolor}</td>
            <td>${dsize}</td>
            <td><span class="tally">${value}</span></td>
            <td><input class="form-check-input" type="checkbox"></td>
          </tr>
          `);
        });

        console.log("Bookmarks", bookmarks);
        //Render Bookmarks
        Object.entries(sort_object(bookmarks)).forEach((bookmark) => {
          const [key, value] = bookmark;
          let bsplit = key.split("_");
          let bname = bsplit[0];
          let bcolor = bsplit[1];
          let bcharm = bsplit[2];
          $("#bookmarks").append(`
          <tr>
            <td scope="row">${bname}</td>
            <td>${bcolor}</td>
            <td>${bcharm}</td>
            <td><span class="tally">${value}</span></td>
            <td><input class="form-check-input" type="checkbox"></td>
          </tr>
          `);
        });

        console.log("Cups", cups);
        //Render Cups
        Object.entries(sort_object(cups)).forEach((cup) => {
          const [key, value] = cup;
          let csplit = key.split("_");
          let cname = csplit[0];
          let ccolor = csplit[1];
          $("#cups").append(`
          <tr>
            <td scope="row">${cname}</td>
            <td>${ccolor}</td>
            <td><span class="tally">${value}</span></td>
            <td><input class="form-check-input" type="checkbox"></td>
          </tr>
          `);
        });
      },
    });
  });
});

function decal_checker(name, variation) {
  let item_title = name.split("|", 1)[0].trim();
  let item_color = "";
  let item_size = "";

  if (variation.indexOf("Style") > 1) {
    item_color = variation.slice(
      variation.indexOf("Color:") + 6,
      variation.indexOf(",Style")
    );
    item_size = variation.slice(
      variation.indexOf("Style") + 6,
      variation.indexOf("Style") + 11
    );
  } else {
    item_color = variation.slice(variation.indexOf("Color:") + 6);
    item_size = "X";
  }

  let complete_item = `${item_title}_${item_color}_${item_size}`;
  if (complete_item in decals) {
    decals[complete_item] += 1;
  } else {
    decals[complete_item] = 1;
  }
}

function bookmark_checker(name, variation) {
  let item_title = name.split("|", 1)[0].trim();
  let item_color = "";
  let item_charm = "";

  if (variation.indexOf("Charm") > 1) {
    item_color = variation.slice(
      variation.indexOf("Color:") + 6,
      variation.indexOf(",Charm")
    );
    item_charm = variation.slice(variation.indexOf("Charm Type:") + 11);
  } else {
    item_color = variation.slice(variation.indexOf("Color:") + 6);
    item_charm = "X";
  }

  let complete_item = `${item_title}_${item_color}_${item_charm}`;
  if (complete_item in bookmarks) {
    bookmarks[complete_item] += 1;
  } else {
    bookmarks[complete_item] = 1;
  }
}

function cup_checker(name, variation) {
  let item_title = name.split("|", 1)[0].trim();
  let item_color = "";

  if (variation.indexOf(",Options") > 1) {
    item_color = variation.slice(
      variation.toLowerCase().indexOf("color:") + 6,
      variation.toLowerCase().indexOf(",options:")
    );
  } else {
    item_color = variation.slice(variation.toLowerCase().indexOf("Color:") + 6);
  }

  let complete_item = `${item_title}_${item_color}`;
  if (complete_item in cups) {
    cups[complete_item] += 1;
  } else {
    cups[complete_item] = 1;
  }
}

function sort_object(obj) {
  return (sorted = Object.keys(obj)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = obj[key];

      return accumulator;
    }, {}));
}
