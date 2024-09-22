//==========================
// COLLEGE FINDER 
//==========================
const countries_el = document.getElementById('countries');
const darkmode_btn = document.getElementById('dark-mode');
const search_el = document.getElementById('search');
const modal = document.getElementById('modal');
const close_btn = document.getElementById('close');
const JSON_DATA_FILE = "json/data.json";
const MIN_SEARCH_LENGTH = 2;
const SEARCH_BAR = document.getElementById("search");
const RESULT_COUNTERS_ID = document.getElementById("result-counters");
const DATA_OUTPUT_DIV = document.getElementById("college-data");
const BUTTON_TOP_ID = document.getElementById("btn-page-top");
const LOAD_MORE_ID = document.getElementById("loadmore");
const LOAD_MORE_BUTTON = document.getElementsByClassName("load-more");
const TOTAL_RECORD_COUNT = document.getElementById("total-record-count");
const SEARCH_RESULT_COUNT = document.getElementById("search-result-count");
const LOAD_TIME_ID = document.getElementById("load-time");
const SALE_RESULT_COUNT = document.getElementById("sale-count");
const DEBUG_DIV = document.getElementById("debug");

// enable dark mode by default.
document.body.classList.toggle('dark');
// Sort JSON results by specified College
function sortJsonByProperty(country) {
  return function (a, b) {
    if (a[country] > b[country]) return 1;
    else if (a[country] < b[country]) return -1;
    return 0;
  };
}

// Input format YYYYMMDD 20210118 and output result: MONTH DAY YYYY Jan 18 2021
function formatDate(dateInput) {
  let datePattern = /(\d{4})(\d{2})(\d{2})/;
  let dateNew = new Date(
    dateInput.replace(datePattern, "$1-$2-$3"));
  dateNew = dateNew.toString().substring(4, 15);
  return dateNew;
}

// Reset fields and hide components
function resetDefaults() {
  RESULT_COUNTERS_ID.style.display = "none";
  SEARCH_BAR.value = "";
  DATA_OUTPUT_DIV.innerHTML = "";
  LOAD_MORE_ID.style.display = "none";
  LOAD_TIME_ID.style.display = "none";
  BUTTON_TOP_ID.style.display = "none";
  DEBUG_DIV.style.display = "none";
  SEARCH_BAR.focus();
}

SEARCH_BAR.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    SEARCH_BAR.blur();
  }
});

SEARCH_BAR.addEventListener("keyup", e => {
  let searchString = e.target.value;
  let timerStart = performance.now();
  fetch(JSON_DATA_FILE)
    .then(res => res.json())
    .then(function (data) {
      data.sort(sortJsonByProperty("country"));
      data.reverse();
      searchString = searchString.trim();
      searchString = searchString.replace(/[|&;$%@"<>()\.//\\+,]/g, "");
      let regExString = "";
      var displayCount = 10;
      const incrementCount = 10;
      let resultCount = 0;
      let saleCount = 0;
      let resultDataOutput = "";
      let runtimeOutput = "";

      if (resultCount !== 0 || searchString.length > MIN_SEARCH_LENGTH) {
        let keywords = searchString.split(" ");
        keywords.forEach(function (keyword) {
          keyword = keyword.trim();
          regExString += `(?=.*${keyword})`;
        });
        let regex = new RegExp(regExString, "gi");
        data.forEach(function (val, key) {
          if (
            val.name.search(regex) != -1 ||
            val.country.search(regex) != -1
          ) {
            resultCount += 1;
            if (val.country !== null) {
              saleCount += 1;
            }
            resultDataOutput += `
            <div class="modal_body"> 
            <div class="card"> 
            <div class="card-body"> 
            
              <h2 class="country-name text-wrap">${val.name} <span class="species">(${val.domains})</span></h2>
              <p class="btn btn-warning"> <strong>Country:</strong> ${(val.country)}</p>
              <p class="country-population"> <strong>Code:</strong> ${(val.alpha_two_code)}</p>
              <p class="country-region"> <strong>Web Pages:</strong> ${(val.web_pages)}</p>
              <a class="btn btn-primary" data-toggle="collapse" href="${(val.web_pages)}"target="_blank" role="button" aria-expanded="false" aria-controls="collapseExample">
              Visit College
            </a>
            </div>
            </div>
            </div>
            </div>
            </div>
        `;
          }
        });
      }
      if (resultCount > 0 && searchString.length > MIN_SEARCH_LENGTH) {
        BUTTON_TOP_ID.style.display = "block";
        RESULT_COUNTERS_ID.style.display = "block";
        SEARCH_BAR.style.color = "";
      } else if (resultCount == 0 && searchString.length > 3) {
        BUTTON_TOP_ID.style.display = "none";
        RESULT_COUNTERS_ID.style.display = "none";
        SEARCH_BAR.style.color = "red";
        LOAD_MORE_ID.style.display = "none";
        resultDataOutput = "";
        runtimeOutput = "";
      } else if (resultCount == 0 || searchString.length <= MIN_SEARCH_LENGTH) {
        BUTTON_TOP_ID.style.display = "none";
        RESULT_COUNTERS_ID.style.display = "none";
        SEARCH_BAR.style.color = "";
        resultDataOutput = "";
        runtimeOutput = "";
      }
      DATA_OUTPUT_DIV.innerHTML = resultDataOutput;
      var collegeList = document.querySelectorAll(".college-item");

      if (document.getElementById("loadmore-button").checked) {
        //-- Load more button version --\\
        // let collegeList = document.querySelectorAll("country");
        for (let i = 0; i < collegeList.length; i++) {
          if (i + 1 <= displayCount) {
            collegeList[i].style.display = "block";
          }
          if (collegeList.length > displayCount) {
            LOAD_MORE_ID.style.display = "block";
            LOAD_MORE_ID.innerHTML = '<button class="button is-info is-medium load-more mb-4">Load More</button>';
            LOAD_MORE_BUTTON[0].addEventListener("click", function () {
              displayCount += incrementCount;
              for (let i = 0; i < collegeList.length; i++) {
                if (i + 1 <= displayCount) {
                  collegeList[i].style.display = "block";
                  LOAD_MORE_ID.style.display = "block";
                  DEBUG_DIV.innerHTML = `Displaying ${displayCount} of ${collegeList.length}`
                }
                if (displayCount > collegeList.length) {
                  LOAD_MORE_ID.style.display = "none";
                }
              }
            });
          } else if (collegeList.length < displayCount) {
            LOAD_MORE_ID.style.display = "none";
          }
        }
      } else if (document.getElementById("loadmore-scroll").checked) {
        //-- Load more infinite scroll version --\\
        // let collegeList = document.querySelectorAll("Country");
        for (let i = 0; i < collegeList.length; i++) {
          if (i + 1 <= displayCount) {
            collegeList[i].style.display = "block";
          }
          if (collegeList.length > displayCount) {
            LOAD_MORE_ID.style.display = "block";
            LOAD_MORE_ID.innerHTML = "Scroll down to load more results...";
            
            window.addEventListener("scroll", () => {
              const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
              if ((scrollTop + clientHeight) > (scrollHeight - 5)) {
                displayCount += incrementCount;
                for (let i = 0; i < collegeList.length; i++) {
                  if (i + 1 <= displayCount) {
                    collegeList[i].style.display = "block";
                    LOAD_MORE_ID.style.display = "block";
                    DEBUG_DIV.innerHTML = `Displaying ${displayCount} of ${collegeList.length}`
                  }
                  if (displayCount > collegeList.length) {
                    LOAD_MORE_ID.style.display = "none";
                  }
                }
              }
            });
          } else if (collegeList.length < displayCount) {
            LOAD_MORE_ID.style.display = "none";
          }
        }

      } else if (document.getElementById("loadmore-none").checked) {
        //-- No load more just show all results --\\
        // let collegeList = document.querySelectorAll("College");
        for (let i = 0; i < collegeList.length; i++) {
          collegeList[i].style.display = "block";
        }
      }

      let timerStop = performance.now();
      if (resultCount !== 0 && searchString.length > MIN_SEARCH_LENGTH) {
        let runTime = (timerStop - timerStart).toFixed(2);
        runtimeOutput = `${runTime} ms`;
      }
      LOAD_TIME_ID.style.display = "block";
      LOAD_TIME_ID.innerHTML = runtimeOutput;
    })
    .catch(function (error) {
      console.log("There was an error with the JSON data file request.", error);
    });
});


// Replace missing college images with placeholder to preserve card layout.
document.addEventListener("error", function (event) {
  if (event.target.tagName.toLowerCase() !== "img") return;
  let altText = event.target.alt.toLowerCase();
  let altTextKeywords = "college Image";
  if (altText.includes(altTextKeywords.toLowerCase())) {
    event.target.src = `${IMAGES_PATH}placeholder/college.jpg`;
    event.target.alt = "Image not found.";
  }
},
  true
);


