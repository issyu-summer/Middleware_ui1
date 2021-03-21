<template>
    <div class="login_container">
        <!--        引入星空背景-->
        <vue-particles>
            .login_container{
            color="#dedede"
            :particleOpacity="0.7"
            :particlesNumber="80"
            shapeType="star"
            :particleSize="4"
            linesColor="#FFFFFF"
            :linesWidth="2"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
            }
        </vue-particles>

        <div class="register_box">
           
            <!-- 用户列表 -->
            <el-table class="usertable" :data="userlist" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="群聊名称" prop="groupName"></el-table-column>
               
                <el-table-column label="操作">
                    <template slot-scope="scope">
                            <el-button type="primary" @click="chat(scope.row.groupId)">开始聊天</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userId:window.sessionStorage.getItem('userId'),
                userlist:[],
            };
        },
        created() {
            this.getUserList();
            this.getNmae();
        },
        methods: {
            async getNmae(){
                const {data: Response} = await this.$http.get("userList", {params:{userId: this.userId}});
                if(Response.msg=="Ok"){
                    window.sessionStorage.setItem('userName', Response.data.username);
                    // this.$message.success("username"+window.sessionStorage.getItem('userName'))
                }
                else this.$message.console.error("获取名称失败");
            },
            async getUserList() {
                // this.$message.success("HERE")
                const {data: Response} = await this.$http.get("groups", {params:{userId: this.userId}});
                if(Response.msg=="OK"){
                    // this.$message.success("HERE")
                    this.userlist=Response.data;
                    console.log(Response.data)
                    // window.sessionStorage.setItem('userName', Response.data.username);
                    // this.$message.success("username"+window.sessionStorage.getItem('userName'))
                }
                else this.$message.console.error("获取列表失败");
            },
            chat(id) {
                window.sessionStorage.setItem('group', id);
                window.sessionStorage.setItem('receiver', '');
                window.sessionStorage.setItem('type', "群聊聊天室");
                // this.$message.success(window.sessionStorage.getItem('receiver'));
                this.$router.push({path: "/chatgroup"});
            },
        }
    };
</script>

<style lang="less" scoped>
    .login_container {
        background-color: rgb(21, 48, 99);
        height: 100%;
    }
   
    .register_box {
        width: 900px;
        height: 600px;
        background-color: #fff;
        border-radius: 5px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }    

    .usertable {
        transform: translate(0, 10%);
        margin-left:50px;
        width: 800px;
        /* padding-bottom: 20px; */
    }

    .el-pagination {
        /*transform: translate(10%,40%);*/
        margin-left:60px;
        padding-top: 360px;
    }
</style>
