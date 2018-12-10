<template style="font-size:16px;">
<div class="container" style="font-size:1rem;">
  osdjfosdf
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">John Smith</p>
          <p class="subtitle is-6">@johnsmith</p>
        </div>
      </div>

      <div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris. <a>@bulmaio</a>.
        <a href="#">#css</a> <a href="#">#responsive</a>
        <br>
        <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
      </div>
    </div>
  </div>


  <div class="columns">
    <div class="column is-one-third">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Component
          </p>
          <a href="#" class="card-header-icon" aria-label="more options">
            <span class="icon">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </a>
        </header>
        <div class="card-content">
          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
            <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
            <br>
            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
          </div>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item">Save</a>
          <a href="#" class="card-footer-item">Edit</a>
      <a href="#" class="card-footer-item">Delete</a>
    </footer>
  </div>
    </div>

</div>

<div class="tabs is-centered is-boxed">
  <ul>
    <li class="is-active">
      <a>
        <span class="icon is-small"><i class="fas fa-image" aria-hidden="true"></i></span>
        <span>Pictures</span>
      </a>
    </li>
    <li>
      <a>
        <span class="icon is-small"><i class="fas fa-music" aria-hidden="true"></i></span>
        <span>Music</span>
      </a>
    </li>
    <li>
      <a>
        <span class="icon is-small"><i class="fas fa-film" aria-hidden="true"></i></span>
        <span>Videos</span>
      </a>
    </li>
    <li>
      <a>
        <span class="icon is-small"><i class="far fa-file-alt" aria-hidden="true"></i></span>
        <span>Documents</span>
      </a>
    </li>
  </ul>
</div>
</div>


</template>


<script>
  export default  {
    data() {

    },
    onLoad() {
      this.getList();
    },
    created(){
    },
    methods: {
      toIndex() {
        wx.navigateTo({
          url: '/pages/index/main',
          success: function(res){
            console.log("success")
          },
        })
      },
      onOverallTag() {
        this.isHidden = !this.isHidden;
      },
      sortSelected() {
        this.isHidden = false;
        this.$http.get('sell#!method=get').then((res)=>{
          this.restaurant =  res.data.data.select;
        })
      },
      onTapTag(e) {
        this.selected = e.currentTarget.dataset.index
      },
      onFilter() {
        wx.showToast({
          title: '代完善',
          icon: 'success',
          duration: 2000
        })
      }




    },
    onReachBottom() {
      let nextPage = this.page +1;
      this.page = nextPage
      wx.showLoading({
        title: '加载中',
      })
      this.$http.get('sell#!method=get').then((res)=>{
        this.restaurant =[...res.data.data.restaurant,...this.restaurant]
        wx.hideLoading();
      }).catch((e)=>{
        console.log(e)
      })
    },
    onPullDownRefreash(){
      this.isShow = !this.isShow
    }




  }
</script>

<style>

 </style>

{
msg: ""
code: ""
data: { errinfo: {

}}
}
