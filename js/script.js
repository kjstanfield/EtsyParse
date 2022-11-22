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
        result.data.forEach((item, index) => {
          // Check Decals that haven't shipped yet
          if (
            item["Date Shipped"] == "" &&
            item["Item Name"].toLowerCase().includes("decal")
          ) {
            decal_checker(
              item["Item Name"],
              item["Variations"],
              item["Listing ID"]
            );
          }

          // Check Bookmarks that haven't shipped yet
          if (
            item["Date Shipped"] == "" &&
            item["Item Name"].toLowerCase().includes("bookmark")
          ) {
            bookmark_checker(
              item["Item Name"],
              item["Variations"],
              item["Listing ID"]
            );
          }

          // Check Cups that haven't shipped yet
          if (
            item["Date Shipped"] == "" &&
            item["Item Name"].toLowerCase().includes("glass")
          ) {
            cup_checker(
              item["Item Name"],
              item["Variations"],
              item["Listing ID"]
            );
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
          let ditem = dsplit[3];
          $("#decals").append(`
          <tr>
            <td scope="row"><a href="https://www.etsy.com/listing/${ditem}">${dname}</a></td>
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
          let bitem = bsplit[3];
          $("#bookmarks").append(`
          <tr>
            <td scope="row"><a href="https://www.etsy.com/listing/${bitem}">${bname}</td>
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
          let citem = csplit[2];
          $("#cups").append(`
          <tr>
            <td scope="row"><a href="https://www.etsy.com/listing/${citem}">${cname}</td>
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

function decal_checker(name, variation, id) {
  let item_title = name.split("|", 1)[0].trim();
  let item_color = "";
  let item_size = "";
  let item_listing = id;

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

  let complete_item = `${item_title}_${item_color}_${item_size}_${item_listing}`;
  if (complete_item in decals) {
    decals[complete_item] += 1;
  } else {
    decals[complete_item] = 1;
  }
}

function bookmark_checker(name, variation, id) {
  let item_title = name.split("|", 1)[0].trim();
  let item_color = "";
  let item_charm = "";
  let item_listing = id;

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

  let complete_item = `${item_title}_${item_color}_${item_charm}_${item_listing}`;
  if (complete_item in bookmarks) {
    bookmarks[complete_item] += 1;
  } else {
    bookmarks[complete_item] = 1;
  }
}

function cup_checker(name, variation, id) {
  let item_title = name.split("|", 1)[0].trim();
  let item_color = "";
  let item_listing = id;

  if (variation.indexOf(",Options") > 1) {
    item_color = variation.slice(
      variation.toLowerCase().indexOf("color:") + 6,
      variation.toLowerCase().indexOf(",options:")
    );
  } else {
    item_color = variation.slice(variation.toLowerCase().indexOf("Color:") + 6);
  }

  let complete_item = `${item_title}_${item_color}_${item_listing}`;
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

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("decalTable");
  console.log(table);
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
