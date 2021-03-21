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
            <div class="avatar_box">
                <!--头像-->
                <img src="../assets/logo.png" alt/>
            </div>
            <!--添加表单-->
            <el-form inline="true" class="register_form" size=medium :model="loginForm">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.userId" prefix-icon="el-icon-user" placeholder="用户ID"></el-input>
                </el-form-item>
                <!-- 添加按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="users">私聊</el-button>
                </el-form-item>
                <el-form-item class="btns1">
                    <el-button type="primary" @click="group">群聊</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm: {
                    username: "",
                },   
            };
        },
        methods: {
            async group() {
                window.sessionStorage.setItem('userId', this.loginForm.userId);
                // this.$message.success(window.sessionStorage.getItem('userId'));
                this.$router.push({path: "/group"});
            },
            users(){
                window.sessionStorage.setItem('userId', this.loginForm.userId);
                // this.$message.success(window.sessionStorage.getItem('userId'));
                this.$router.push({path: "/private"});
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
        width: 500px;
        height: 250px;
        background-color: #fff;
        border-radius: 5px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .avatar_box {
            width: 100px;
            height: 100px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            
    }
    img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }

    .register_form {
        position: absolute;
        left: 50%;
        top: 60%;
        transform: translate(-50%, -50%);
        
        box-sizing: border-box;
    }

    .btns1{
        margin-left:80px
    }

    
</style>
