
<template>
  <div class="profile" v-if="isMounted">
    <div class="profile__container">
      <div class="profile__header">
        <div class="modSelect">
          <div :class="classes.mod0" @click="setMode(0)"></div>
          <div :class="classes.mod1" @click="setMode(1)"></div>
          <div :class="classes.mod2" @click="setMode(2)"></div>
          <div :class="classes.mod3" @click="setMode(3)"></div>
          <div :class="classes.mod4" @click="setMode(4)"></div>
        </div>
        <div class="profile__info">
          <div class="profile__info__avatar__username">
            <div class="profile__image" :style="avatarStyle"></div>
            <div class="baseInfo">
              <h5 class="nickname">{{ stats.username }}</h5>
              <div class="duiashduash" style="display: block">
                <div class="profile__info__badges">
                  <div
                    class="infoBadge"
                    v-for="(badge, index) of verifyed_types_str"
                    :key="index"
                  >
                    <div v-b-tooltip.hover :title="badge.tooltip">
                      <img :src="badge.badgeURL" width="32" height="32" />
                    </div>
                  </div>
                  <img
                    v-if="isSupporter"
                    id="supporter__img"
                    class="supporter"
                    src="/static/img/love.svg"
                    alt=""
                    width="40px"
                    v-b-tooltip.hover
                    title="supporter"
                  />
                  <b-tooltip
                    v-if="isSupporter"
                    target="supporter__img"
                    title="supporter"
                    triggers="hover"
                  >
                    supporter
                  </b-tooltip>
                </div>
                <div class="country">
                  <img
                    id="flag__img"
                    v-b-tooltip.hover
                    :title="stats.country_name"
                    class="flag"
                    :src="`https://osu.gatari.pw/static/images/flags/${stats.country}.png`"
                    style="height: 30px"
                  />

                  <p class="country__name">{{ stats.country_name }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="profile__info__stats__box">
            <div class="statsInfo stats1">
              <h3>Ranked score:</h3>

              <h3>Playcount:</h3>
              <h3>Accuracy:</h3>
              <h3>Level:</h3>
              <h3>Watched Replays:</h3>
            </div>
            <div class="stats2">
              <p>{{ stats.ranked_score }}</p>
              <p>{{ stats.playcount }}</p>
              <p>{{ (stats.accuracy * 100).toFixed(2) }}%</p>
              <p>{{ stats.level }}</p>
              <p>{{ stats.replays_watched }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="profile__friends" style="display: none">
        <button class="add__friends">
          <img
            class="friends"
            src="/static/img/friends.svg"
            alt=""
            width="40px"
            height="40px"
          />
        </button>
      </div>
      <div class="profile__body">
        <div class="profile__info__body">
          <div class="profile__info__body__stats">
            <v-stat
              name="Perfomance Points"
              :description="`${String(stats.performance).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ','
              )}`"
              color="red"
              descsize="32px"
              center
            ></v-stat>
          </div>

          <div class="profile__info__body__ranks">
            <div class="followers">
              <v-stat
                name="Joined"
                class="profile__info__body__ranks__followers"
                color="green"
                :description="joined"
              />

              <v-stat
                name="Followers"
                color="purple"
                :description="stats.followers || 0"
              />
            </div>
            <!--- <div class="ssHD">
                        <div class="rank score-rank putin rank-SSHD"></div>
                        <p>0</p>
                    </div>
                    <div class="jopa">
                        <div class="rank score-rank rank-SS"></div>
                        <p>0</p>
                    </div>
                    <div class="jopa">
                        <div class="rank score-rank rank-SHD"></div>
                        <p>0</p>
                    </div>
                    <div class="jopa">
                        <div class="rank score-rank rank-S"></div>
                        <p>0</p>
                    </div>
                    <div class="jopa">
                        <div class="rank score-rank rank-A"></div>
                        <p>0</p>
                    </div>  
                    </div>--->
          </div>
        </div>
        <div class="profile__ranking">
          <v-ppchart
            v-if="chartLoaded"
            style="display: flex; flex: 1; width: 70%"
            :is-relax="this.isRelax"
            :pp-history="this.ppHistory"
            :gamemode="mode"
          ></v-ppchart>
          <div class="nothing" v-else></div>
          <div class="profile__ranking__global">
            <v-stat
              name="Global Ranking"
              :description="`#${String(stats.place).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ','
              )}`"
              color="pink"
              descsize="40px"
            ></v-stat>
          </div>
        </div>

        <div class="profile__scores" v-if="scores.best.length">
          <div class="profile__scores__best">
            <div class="profile__scores__title">Best scores</div>

            <div
              class="profile__scores__score"
              v-for="(score, index) of scores.best"
              :key="index"
            >
              <div
                :class="`rank-${score.rank}`"
                style="
                  width: 64px;
                  height: 32px;
                  background-repeat: no-repeat;
                  background-size: contain;
                  background-position: center;
                "
              ></div>

              <div class="profile__scores__score__main">
                <div class="profile__scores__score__main__beatmap__title">
                  <router-link
                    :to="`/b/${score.beatmap.id}`"
                    class="profile__scores__score__main__beatmap__title__link"
                  >
                    {{ score.beatmap.beatmap_name }}
                  </router-link>

                  <div
                    class="profile__scores__score__main__beatmap__title__mods"
                  >
                    {{ getScoreMods(score.mods) }}
                  </div>
                </div>
                <div class="profile__scores__score__main__beatmap__info">
                  [{{ score["100_count"] }}x100/{{ score["50_count"] }}x50/{{
                    score["miss_count"]
                  }}xMiss] x{{ score["max_combo"] }}
                  <div
                    class="profile__scores__score__main__beatmap__info__accuracy"
                  >
                    {{ (score.accuracy * 100).toFixed(2) }}%
                  </div>
                  {{
                    require("moment")(
                      new Date(score.timestamp * 1000)
                    ).fromNow()
                  }}
                </div>
              </div>
              <div class="profile__scores__score__etc">
                <div class="profile__scores__score__etc__pp">
                  {{ Math.floor(score.pp) }}PP
                </div>
              </div>
            </div>

            <b-overlay
              :show="moreLoading"
              class="profile__scores__load__btn d-inline-block"
              rounded
              opacity
              spinner-small
              spinner-variant="primary"
              v-if="scores.best.length > 0"
              style="margin: 0 40%"
            >
              <b-button variant="primary" @click="load_scores">
                Load more scores
              </b-button>
            </b-overlay>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VFlag from "@/components/v-flag";
import VStatsbox from "@/components/v-statsbox";
import VScorebox from "@/components/v-scorebox";
import VRank from "@/components/v-rank";
import VStat from "@/components/v-stat";
import VPpchart from "../components/v-ppchart";
import moment from "moment";
import bbCodeParser from "js-bbcode-parser";
import editIcon from "vue-material-design-icons/Pencil";
import VScoreTooltip from "../components/v-score-tooltip.vue";
import countries from "i18n-iso-countries";

export default {
  name: "v-profile",
  components: {
    VPpchart,
    VStat,
    VRank,
    VScorebox,
    VStatsbox,
    VFlag,
    editIcon,
    VScoreTooltip,
  },

  data() {
    return {
      classes: {
        mod0: "mod0 activemod",
        mod1: "mod1 inactivemod",
        mod2: "mod2 inactivemod",
        mod3: "mod3 inactivemod",
        mod4: "mod4 inactivemod",
      },
      best_limit: 0,
      isMounted: false,
      moreLoading: true,
      token: this.$store.state.token,
      id: this.$route.params.id,
      backgroundURL:
        "https://media.discordapp.net/attachments/704347465809133638/733412691288522812/20200711_222935.jpg",
      haveBG: false,
      bgStyle: "",
      avatarURL: "",
      joined: "",
      isMe: false,

      mode: 0,
      isRelax: false,
      chartLoaded: false,
      ppHistory: [],
      parsedUserpage: "",
      avatarStyle: "",
      stats: {
        id: 1,
        username: "Egg",
        place: 0,
        level: 1337,
        playcount: 0,
        pp: 0,
        country: "XX",
        ss_ranks: 0,
        s_ranks: 0,
        a_ranks: 0,
        replays_watched: 0,
        ranked_score: 0,
        total_score: 0,
        total_hits: 0,
        accuracy: 100.0,
        account_created_at: 1,
      },
      scores: {
        best: [],
        recent: [],
      },
      verified_type: 0,
      verifyed_types_str: [],
      isSupporter: false,
    };
  },
  methods: {
    async load_scores() {
      this.moreLoading = true;

      this.best_limit += 5;
      let scoresbest_tmp = await fetch(
        `/api/users/profile/best_scores?u=${this.id}&m=${this.mode}&r=${this.isRelax}&l=${this.best_limit}`
      )
        .then((r) => r.json())
        .catch((e) => alert(e.message));
      scoresbest_tmp = scoresbest_tmp.filter((score) => score.pp > 0);
      let items = [];
      for (let i = 0; i < scoresbest_tmp.length; i++) {
        let item = scoresbest_tmp[i];

        if (!item) return;
        item.link = `/b/${item.beatmap_id}`;
        try {
          item.beatmap_title = item.beatmap.beatmap_name;
        } catch (e) {
          console.log(e);
        }
        item.rankClasses = `rank-${item.rank} score--rank`;

        items.push(item);
        
      }


      this.scores.best = items;

      this.moreLoading = false;
    },

    async setVerifiedType() {
      const verified_types = {
        osu: 1 << 4,
        taiko: 2 << 4,
        ctb: 4 << 4,
        mania: 8 << 4,
        rx: 16 << 4,
      };

      let getMode = (type) => {
        let r = "";
        switch (type) {
          case 16:
            r = {
              name: "osu!",
              mode: 0,
              url: `/static/osustd.png`,
            };
            break;
          case 32:
            r = {
              name: "osu!taiko",
              mode: 1,
              url: `/static/osutaiko.png`,
            };
            break;
          case 64:
            r = {
              name: "osu!ctb",
              mode: 2,
              url: `/static/osuctb.png`,
            };
            break;
          case 128:
            r = {
              name: "osu!mania",
              mode: 3,
              url: `/static/osumaniapng.png`,
            };
            break;
          case 256:
            r = {
              name: "osu!relax",
              mode: 4,
              url: `/static/img/osurx.png`,
            };
            break;
          default:
            r = {
              name: "unknown",
              mode: 0,
              url: `/static/osustd.png`,
            };
            break;
        }

        return r;
      };

      Object.entries(verified_types).forEach((type) => {
        if ((this.verified_type & type[1]) > 0) {
          this.verifyed_types_str.push({
            tooltip: `Verified ${getMode(type[1]).name} Player`,
            mode: getMode(type[1]).mode,
            badgeURL: getMode(type[1]).url,
          });
        }
      });
    },

    async changeRelax() {
  
      this.scores.best = [];

   
    },

    async setPPHistory() {
      this.chartLoaded = false;
      //this.ppHistory = await fetch(`/frontend/api/v1/user/pp_graph?id=${this.id}&r=${this.isRelax}`).then(res => res.json());
      //this.ppHistory = this.ppHistory.result.filter(score => this.isRelax ? score.is_relax : !score.is_relax);
      //this.chartLoaded = true;
    },

    async setMode(mode) {
      this.isRelax = mode === 4;
      if(this.isRelax) this.changeRelax();

      this.mode = this.isRelax ? 0 : mode;
      for (const entry of Object.entries(this.classes)) {
        if (entry[1].split(" ")[1] === "activemod") {
          this.classes[entry[0]] = this.classes[entry[0]].replace(
            "activemod",
            "inactivemod"
          );
        }
      }
      this.classes[`mod${mode}`] = `mod${mode} activemod`;

      this.scores.best = [];
      await this.load_scores();
      this.best_limit = 0;
      this.stats = await this.axios
        .get(
          `/api/users/profile/info?u=${this.id}&m=${this.mode}&r=${this.isRelax}`
        )
        .then((r) => r.data)
        .catch((e) => this.$router.push({ path: "/404" }));
      await this.setPPHistory();
    },
    getScoreMods(m, noplus) {
      let modsString = [
        "NF",
        "EZ",
        "NV",
        "HD",
        "HR",
        "SD",
        "DT",
        "RX",
        "HT",
        "NC",
        "FL",
        "AU",
        "SO",
        "AP",
        "PF",
        "K4",
        "K5",
        "K6",
        "K7",
        "K8",
        "K9",
        "RN",
        "LM",
        "K9",
        "K0",
        "K1",
        "K3",
        "K2",
      ];
      let r = [];
      // has nc => remove dt
      if ((m & 512) === 512) m = m & ~64;
      // has pf => remove sd
      if ((m & 16384) === 16384) m = m & ~32;
      modsString.forEach(function (v, idx) {
        let val = 1 << idx;
        if ((m & val) > 0) r.push(v);
      });
      if (r.length > 0) {
        return (noplus ? "" : "+ ") + r.join(", ");
      } else {
        return "";
      }
    },

    async getID() {
      const { result } = await fetch(`/api/users/what_id?u=${this.id}`)
        .then((res) => res.json())
        .catch((e) => {
          this.$router.push({ path: "/404" });
        });
      if (!parseInt(result)) return this.$router.push({ path: "/404" });
      window.location.href = `/u/${result}`;
    },
  },

  mounted: async function () {
    if (!parseInt(this.id)) return await this.getID();
    let stats = {};

    await this.axios
      .get(
        `/api/users/profile/info?u=${this.id}&m=${this.mode}&r=${this.isRelax}`,
        this.token ? { headers: { authorization: this.token } } : {}
      )
      .then((r) => {
        if (r.data.constructor.name !== "Object") {
          this.$router.push({ path: "/404" });
        } else {
          stats = r.data;
        }
      })
      .catch((e) => this.$router.push({ path: "/404" }));

    if (this.$store.state.token) {
      let myProfile = await fetch("/api/users/me", {
        headers: {
          Authorization: this.$store.state.token,
        },
      }).then((res) => res.json().catch((e) => {console.log(e)}));
      if (!myProfile?.id) myProfile = { id: 0 };
      let id = myProfile.id;
      if (parseInt(this.id) === id) this.isMe = true;
    }

    //this.isSupporter = (this.stats.is_supporter) > (Date.now() / 1000);

    this.bgStyle = `z-index: 0; width: 100%; height: 300px; background-image: url("${this.backgroundURL}");`;
    this.avatarURL = `https://a.fbk.sh/${stats.id}`;

    let avatarStatus = await fetch(`${this.avatarURL}`).catch((e) => {console.log(e)});

    if (!avatarStatus || !avatarStatus.ok) {
      this.avatarStyle = `background-image: url(https://i1.sndcdn.com/avatars-32EHFzqYhcwAzmuk-mE2q0g-t500x500.jpg); width: 150px; height: 150px; background-size: cover; background-position: center;`;
    } else {
      this.avatarStyle = `background-image: url(${this.avatarURL}); width: 150px; height: 150px; background-size: cover; background-position: center;`;
    }

    if (this.$route.query.relax === "true") await this.setMode(4);
    else await this.setMode(this.$route.query.mode || 0);
    this.joined = moment(new Date(stats.account_created_at * 1000)).fromNow();
    this.moreLoading = false;

    this.stats = stats;
    this.$meta()
      .addApp("custom")
      .set({
        title: `${stats.username}\`s Profile - Astellia`,
      });

    this.isMounted = true;
  },
  metaInfo: {
    title: "Profile",
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;1,400&display=swap");

@media only screen and (max-width: 800px) {
  .modSelect {
    margin: 0 auto !important;
    justify-content: center !important;
  }

  .profile__info {
    display: block !important;
  }

  .profile__info__stats__box {
    margin: 25px auto !important;
  }

  .profile__info__avatar__username {
    display: block !important;
  }
  .profile__image {
    margin: 0 auto !important;
  }
  .baseInfo {
    text-align: center;
  }
  .duiashduash {
    margin: 0 auto;
  }

  .country {
    display: block !important;
    width: 100% !important;
  }
  .profile__info__body {
    display: block !important;
    margin-bottom: 1.5rem;
  }
  .followers {
    display: block !important;
  }
  .profile__info__body__ranks {
    display: block !important;
  }

  .followers:first-child {
    margin: 0 auto !important;
  }

  .profile__ranking__global {
    width: 100%;
    padding: 0 !important;
  }

  .profile__scores__score {
    display: block !important;
  }

  .profile__scores__score__main__beatmap__title {
    display: block !important;
  }
  .profile__scores__score__main__beatmap__title__link {
    text-align: center;
    display: block !important;
  }

  .profile__scores__score__main {
    width: 100% !important;
  }

  .rank-A {
    margin: 10px auto;
  }
  .rank-B {
    margin: 10px auto;
  }
  .rank-C {
    margin: 10px auto;
  }
  .rank-D {
    margin: 10px auto;
  }
  .rank-S {
    margin: 10px auto;
  }
  .rank-SH {
    margin: 10px auto;
  }
  .rank-SS {
    margin: 10px auto;
  }
  .rank-SSHD {
    margin: 10px auto;
  }

  .btn {
    width: 100%;
  }

  .profile__scores__score__main__beatmap__title__mods {
    text-align: center;
  }

  .profile__scores__score__main__beatmap__info {
    display: block !important;
    text-align: center;
    padding-bottom: 5px;
    border-bottom: 2px solid white;
  }

  .profile__scores__load__btn {
    width: 100%;
    margin: 0 auto !important;
  }
  .statsInfo h3 {
    width: auto !important;
  }
}

.profile__info__body__ranks__followers {
  margin: 0 auto;
}
.score {
  display: flex;
}

.scores {
  margin: 0 auto;
  width: 60%;
}

.score__part1 {
  width: 400px;
  height: 50px;
  background-color: red;
}
.score__part2 {
  width: 400px;
  height: 50px;
  background-color: blue;
}

/*    .ranks {
        padding-left: 300px;
    }*/

.razdel h1 {
  font-size: 24px;
}

.countryWorld {
  margin-left: -50px;
  margin-top: 50px;
  text-align: center;
}

.stats2 p {
  padding: 0 10px;
}

.countryWorld h5 {
  font-size: 24px;
}

.countryWorld p {
  font-size: 32px;
}

.ratingWorld {
  margin-top: 50px;
  margin-left: -50px;
  text-align: center;
}

.ratingWorld h5 {
  font-size: 24px;
}

.ratingWorld p {
  font-size: 32px;
}

.rankingChart {
  display: flex;
}

.jopa {
  text-align: center;
}

.ssHD {
  text-align: center;
}

.rank {
  margin-right: 5px;
}

.rank-A {
  background-image: url(/static/ranks/A.svg?3);
}
.rank-B {
  background-image: url(/static/ranks/B.svg?3);
}
.rank-C {
  background-image: url(/static/ranks/C.svg?3);
}
.rank-D {
  background-image: url(/static/ranks/D.svg?3);
}
.rank-SHD {
  background-image: url(/static/ranks/SHD.svg?3);
}
.rank-S {
  background-image: url(/static/ranks/S.svg?3);
}
.rank-SSHD {
  background-image: url(/static/ranks/SSHD.svg?3);
}
.rank-SS {
  background-image: url(/static/ranks/SS.svg?3);
}

.score-rank {
  width: 3em;
  height: 1em;
  background-size: 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  transform: scale(1.5);
}

.pp {
  border-top: 2px solid blue;
}

.medals {
  border-top: 2px solid green;
}

.timeGame {
  border-top: 2px solid red;
}

.razdel {
  margin-right: 30px;
}

.infoBody {
  padding-left: 20px;
  padding-bottom: 20px;
  display: flex;
}

.me {
  font-size: 38px;
  padding: 0 30px;
  display: block;
}

.description {
  height: 400px;
  overflow: auto;
}

.profile__container {
  margin: 0 auto;
  width: 80%;
  height: auto;
  margin-bottom: 400px;
}

.add__friends {
  width: 90px;
  height: 50px;
  border: 0;
  background: #5162b5;
  margin-top: 25px;
  margin-left: 40px;
  border-radius: 25px;
}

.profile__header {
  margin-top: 50px;
  padding: 20px 0px;
  background: #21263e;
}

.profile__body {
  padding: 20px 0px;
  background: #21263e;
}

.profile__friends {
  background: #32395e;
  height: 100px;
}

.stats1 {
  background: #32395e;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  bottom: 5px;
  -webkit-box-shadow: -5px 5px 14px 0px rgba(50, 57, 101, 0.75);
  -moz-box-shadow: -5px 5px 14px 0px rgba(50, 57, 101, 0.75);
  box-shadow: -5px 5px 14px 0px rgba(50, 57, 101, 0.75);
}
.stats2 {
  background: #32395e;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  -webkit-box-shadow: 0px 7px 14px 0px rgba(50, 57, 101, 0.75);
  -moz-box-shadow: 0px 7px 14px 0px rgba(50, 57, 101, 0.75);
  box-shadow: 0px 7px 14px 0px rgba(50, 57, 101, 0.75);
  bottom: 5px;
}

.supporter {
  color: white;
}

p {
  line-height: 0.85;
  margin-top: 13px;
}

.nickname {
  font-size: 32px;
  padding-top: 5px;
}

.profile__image {
  border-radius: 40px;
  margin-top: 10px;
  margin-left: 20px;
}

.baseInfo {
  margin-top: 10px;
  margin-left: 15px;
}

.flag {
  margin-right: 10px;
}

.country__name {
  margin-top: 8px;
}

.duiashduash {
  margin-top: 20px;
}

.supporter {
  padding-bottom: 5px;
}

.country {
  width: 60%;
  display: flex;
  border-top: 1px solid #fff;
  padding-top: 7px;
}

.statsInfo h3 {
  font-size: 18px;
  margin-top: 8px;
  width: 250px;
  text-align: left;
  padding: 0 10px;
}

.profile__info {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.profile__info__avatar__username {
  display: flex;
}

.profile__info__stats__box {
  display: flex;
}

.stats1 {
  flex: 1;
}
.profile__info__stats {
  display: flex;
  justify-content: space-between;
}

.profile__info__stats__chart {
  display: flex;
  flex: 1;
}

.profile__info__body {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}

.profile__info__body__ranks {
  display: flex;
}

.profile__ranking {
  display: flex;
  justify-content: space-between;
}
.profile__ranking__global {
  padding-left: 15px;
}

.profile__ranking {
  padding: 0 30px;
  background-color: #21263e;
}

.profile__scores {
  padding: 40px 30px;
  background-color: #21263e;
}

.profile__scores__title {
  text-align: center;
  font-size: 36px;
}

.profile__scores__score {
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  align-items: center;

  background-color: #0f142d;

  border: 1px solid transparent;
  border-radius: 10px;

  width: auto;
  min-width: 65%;
  padding: 0 10px;
  font-family: "Roboto", sans-serif;
}

.profile__scores__score__main__beatmap__info {
  font-size: 14px;
}

.profile__scores__score__main__beatmap__title {
  display: flex;
}

.profile__scores__score__main__beatmap__title__mods {
  color: yellow;
}

.profile__scores__score__main__beatmap__info {
  display: flex;
}

.profile__scores__score__main__beatmap__info__max__combo {
  padding-right: 5px;
  color: yellow;
}

.profile__scores__score__main__beatmap__title {
  display: flex;
}

.profile__scores__score__main__beatmap__title__link {
  display: flex;
  color: white !important;
}

.profile__scores__score__main__beatmap__title__link:hover {
  color: white !important;
}

.profile__scores__score__etc {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile__scores__score__etc__weighed {
  padding-right: 15px;
}

.profile__scores__score:not(:first-child) {
  margin: 5px 0;
}

.profile__scores__score__etc__pp {
  font-size: 18px;
  color: goldenrod;
  font-weight: bold;
}

.profile__scores__score__main__beatmap__title__mods {
  padding-left: 10px;
}

.score-button {
  outline: none;
  background-color: #5639ac;
  border: 1px solid #5639ac;
  color: white;
  margin-top: 15px;
  width: 156px;
  height: 40px;
  border-radius: 10px;
  transition: 0.2s;
}
.score-button:hover {
  background-color: #5639d5;
  border: 1px solid #5639d5;
}

.modSelect {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  right: 0;
}

.mod0 {
  width: 32px !important;
  height: 32px !important;
  z-index: 10;
  background-size: cover;
  background-image: url(/static/img/osustd.png);
}
.activemod {
  margin: 10px;
  filter: brightness(1);
}
.inactivemod {
  margin: 10px;
  filter: brightness(0.6);
  transition: 0.3s;
}
.inactivemod:hover {
  filter: brightness(0.9);
}

.mod1 {
  width: 32px !important;
  height: 32px !important;
  z-index: 10;
  background-size: cover;
  background-image: url(/static/img/osutaiko.png);
}
.mod2 {
  width: 32px !important;
  height: 32px !important;
  z-index: 10;
  background-size: cover;
  background-image: url(/static/img/osuctb.png);
}
.mod3 {
  width: 32px !important;
  height: 32px !important;
  z-index: 10;
  background-size: cover;
  background-image: url(/static/img/osumaniapng.png);
}
.mod4 {
  width: 32px !important;
  height: 32px !important;
  z-index: 10;
  background-size: cover;
  background-image: url(/static/img/osurx.png);
}

.profile__info__badges {
  display: flex;
}

.profile__scores__score__main {
  width: 60%;
}

.profile__info__badges {
  margin-bottom: 3px;
}

.followers {
  display: flex;
}

.profile__scores__score__main__beatmap__info__accuracy {
  color: aqua;
  padding: 0 5px;
}

.profile__info__body__ranks__followers {
  margin: 0 10px;
}
</style>