import React from "react";

const PaginationsHistory = () => {
  return (
    <div>
      <nav class="navigation post-navigation" aria-label="Posts">
        <div class="row nav-links">
          <div class="col-6 nav-previous">
            <a href="#" rel="prev">
              <span class="ast-left-arrow">←</span> Previous Page
            </a>
          </div>
          <div class="col-6 nav-next text-end">
            <a href="#" rel="next">
              Next Page <span class="ast-right-arrow">→</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PaginationsHistory;
