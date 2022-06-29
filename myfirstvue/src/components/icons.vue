


<style>

.my-app-icon {
  font-family: 'My App Icon';
  font-weight: 400;
  font-size: 24px;
}

@font-face {
  font-family: 'My App Icon';
  font-style: normal; /* whatever is required for your */
  font-weight: 400;   /* webfont.... */
  src: url("./themes/fonts/brystonadd.woff") format("woff");
}

.my-app-icon.true {
    /*color: #1976D2;*/
    color: orange;
}


.icon-play::before {
    content: "\e616";
}

.icon-pause::before {
    content: "\e615";
}

.play::before {
    content: "\e615" !important;
}


.icon-stop::before {
    content: "\e614";
}

.icon-next::before {
    content: "\e613";
}

.icon-previous::before {
    content: "\e612";
}

.icon-shuffle::before {
    content: "\e617";
}

.icon-loop::before {
    content: "\e618";
}



</style>
