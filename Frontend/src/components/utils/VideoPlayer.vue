<template>
  <div>
    <video
      ref="videoPlayer"
      w=100
      :height="height"
      class="video-js vjs-theme-city vjs-big-play-centered"
    >
      <source type="video/mp4">
    </video>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    poster: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    player: null,
  }),
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, {
      controls: true,
      autoplay: false,
      preload: 'none'
    })
    this.player.src({ type: 'video/mp4', src: this.src })
    this.player.poster(this.poster)
    this.player.play()
  },
  beforeDestroy() {
    if (this.player) this.player.dispose()
  }
}
</script>

<style scoped>
  @import "https://vjs.zencdn.net/7.11.4/video-js.css";
</style>