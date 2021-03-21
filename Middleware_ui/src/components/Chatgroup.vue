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

      <!-- 外围白框 -->
      <div class="register_box">
          <!-- 布局框 -->
          <div class="common-layout">
              <el-container height="600px" >
                  <!-- 侧边-人员列表 -->
                <el-aside width="250px"  vertical >
                  <el-table :data="tableData">
                      <el-table-column prop="name" label="用户信息">
                      </el-table-column>
                    </el-table>
                </el-aside>
                <!-- 上方-标题 -->
                <el-container>
                  <el-header height="50px">{{this.type}}</el-header>

                  <!-- 中间-聊天框 -->
                  <el-main width="650px" height="400px">
                    <el-table :data="messageData" class="table" :show-header=false height="360px">
                      <el-table-column prop="senderId" label="姓名" width="80px" ></el-table-column>
                      <el-table-column prop="content" label="消息内容"></el-table-column>
                      <el-table-column prop="date" label="日期" width="150px"></el-table-column>
                    </el-table>
                  </el-main>

                  <!-- 底部-输入框 -->
                  <el-footer height="150px">
                      <el-input type="textarea" :rows="3" v-model="input" placeholder="请输入内容"></el-input>
                      <el-row :gutter="40">
                      <el-button class="btns" type="primary" @click="send">发送消息</el-button>
                      <el-button type="text" @click="dialogVisible = true">发送文件</el-button>
                      <el-button type="text" @click="relay">转发已有文件</el-button>
                      </el-row>
                  </el-footer>

                </el-container>
              </el-container>
            </div>
         
      </div>
<!-- 文件选择弹出框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
       <span>选择上传文件</span>
       <span slot="footer" class="dialog-footer">
        <el-upload class="upload-demo" 
        action="http://localhost:9000/fileSave/"
        :on-success="handleSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :file-list="fileList">
        <el-button type="primary">文件上传</el-button>
      </el-upload>
        <el-button class="btn2" @click="confirm">确定</el-button>
      </span>
      </el-dialog>

      <!-- 转发文件选择弹出框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible_relay" width="30%">
       </el-upload>
        <el-input v-model="relayName" placeholder="要转发的文件名称(如 test.txt)"></el-input>
         <el-button class="btn2" @click="confirm_relay">确定</el-button>
       </span>
       </el-dialog>


  </div>
</template>

<script>
  var socket;let vueComponent;
  export default {
      data() {
          return {
            chatClose:false,
            relayName:'',
            dialogVisible: false,
            dialogVisible_relay:false,
            fileList:[],
              input: '',//输入的消息
              tableData:[],//用户信息
              messageData:[],//消息记录
              msgType:0,//默认为0，普通消息
              fileName:'',
              type: window.sessionStorage.getItem('type'),//Header标题私聊or群聊
              receiverId:window.sessionStorage.getItem("receiver"),
              groupId:window.sessionStorage.getItem("group"),
              userId:window.sessionStorage.getItem("userId"),
          };
      },
      created() {
        this.getUserList();
        this.getMessage();
        this.createWebsocket();
      },
      destroyed(){
        console.log("destroyed")
        this.closeWebsocket();
      },
      
      methods: {
          relay(){
            this.dialogVisible_relay=true;
          },
          async confirm_relay(){
            const {data: Response} = await this.$http.get("download",{params:{fileName:this.relayName}});
            this.input="转发了"+this.relayName+"文件："+Response.data;
            this.dialogVisible_relay=false;
            this.msgType=1;
            this.send();
          },
          async confirm(){//结束文件传输的窗口
            const {data: Response} = await this.$http.get("download",{params:{fileName:this.fileName}});
            this.input="发送了"+this.fileName+"文件："+Response.data;
            this.dialogVisible = false;
            this.msgType=1;
            this.send();
          },
          async getMessage(){
              const {data: Response} = await this.$http.get("record", {params:{receiverId: this.receiverId, groupId:this.groupId, senderId:this.userId } });
              if(Response.code==0){
                  this.messageData=Response.data.msgs;
              }
              else this.$message.console.error(Response.msg);

          },
          async send() {
              const {data: Response} 
              = await this.$http.get("send", {params:{receiverId: this.receiverId, groupId:this.groupId,senderId:this.userId,msg:this.input,type:this.msgType,fileName:this.fileName} });
              if(Response.code==0){
                this.$message.success("发送成功");
                this.fileName="";
                this.msgType=0;
                var aData = new Date();
                console.log(this);
                console.log(vueComponent);
                this.messageData.push(
                 {
                  senderId: this.userId,
                  content: this.input,
                  // date:aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate()+"-"+aData.getUTCHours()+":"+aData.getUTCMinutes()
                  }
                ) 
                this.input="";
                console.log("debug")
                this.webSocketFunction();
                console.log("debug1")
              }
              else this.$message.success(Response.msg);

              
          },
          async getUserList() {//FIXME
              if(this.type=="私聊聊天室") this.tableData=[{name:window.sessionStorage.getItem("receiverName")}]
              else{
              const {data: Response} = await this.$http.get("members", {params:{groupId: this.groupId}});
              if(Response.msg=="OK"){
                  this.tableData=Response.data;
              }
              else this.$message.console.error("获取列表失败");
              }
          },
          // 文件传输部分
          //files是本次选择的文件
          //fileList是当前uploader对象中待上传的文件列表
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handlePreview(file) {
            console.log(file);
          },
          beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
          },
          handleSuccess(res,file){
            this.fileName=file.name;
            this.$message.success("上传文件"+file.name+"成功");
          },

          //启动时 new websocket
          createWebsocket(){
            let json="";
            vueComponent=this;
            console.log(vueComponent);
            if(typeof(WebSocket) == "undefined") {
              this.$message.error("您的浏览器不支持WebSocket");
            }else {
              this.$message.success("您的浏览器支持WebSocket");
            }
            //建立webSocket连接,
            //ws://localhost:8080/websocket/{username}/{identityName}
            //此处需要获取出username,和queueName或者identityName
            let username=window.sessionStorage.getItem('userName');
            let identityName="topic01"
            let socketUrl = "ws://localhost:9000/websocket/"+username+"/"+identityName;

            socket = new WebSocket(socketUrl);
            //至此,服务端和客户端建立webSocket连接成功
            if(socket==null){
            //几乎不会失败
            console.log("建立连接失败")
            }else {
              console.log("建立连接成功,socketUrl=" + socketUrl);
            }
            //打开连接,仅仅打开连接并不能输出任何信息。
            socket.onopen = function() {
            console.log("websocket连接🔗已启用");
            }
            //获得消息事件,才能真正的输出服务器传到前端的信息
            //从WebSocketServer.onOpen()/onMsg()/onClose()处传入的消息都要通过socket.onmessage来接收

            // //按照逻辑,首先初始化一次,获取上次还未消费到的消息。
            let initJson="";
            socket.onmessage=function (msg){
              initJson=msg.data;
              console.log(typeof(msg.data)=="string");
              console.log("debug1"+msg.data.senderId);
              console.log(initJson);
              var obj = JSON.parse(initJson);
              console.log(obj);
              console.log(typeof (obj));
              if(Array.isArray(obj)){
                for(var i=0;i<obj.length;i++){
                  vueComponent.messageData.push( {
                    senderId: obj[i].senderId,
                    content: obj[i].content
                    // date:aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate()+"-"+aData.getUTCHours()+":"+aData.getUTCMinutes()
                  })
                }
              }else {
                vueComponent.messageData.push( {
                senderId: obj.senderId,
                content: obj.content
                // date:aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate()+"-"+aData.getUTCHours()+":"+aData.getUTCMinutes()
              })
              }
            }
            //如果初始化消息不为空的话,就要初始化聊天窗口
            if(initJson!==""){
                console.log(initJson);//FIXME
                // this.messageData.push(
                //     {
                //       senderId: initJson.senderId,
                //       content: initJson.content,
                //       // date:aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate()+"-"+aData.getUTCHours()+":"+aData.getUTCMinutes()
                //     }
                // )
                // this.messageData.push(
                //   {

                //   }
                // )

            }
          },

          webSocketFunction(){//发
            let str=window.sessionStorage.getItem('userName');
            //消息的数量
            // //当chat关闭的时候,会跳出循环,自然进入到了关闭连接
            // //有问题,chat不断轮询,资源必然会耗尽
            // while (!this.chatClose){
            console.log(str)
            for(var i=0;i<vueComponent.tableData.length;i++){
                  if(vueComponent.tableData[i].name!==str){
                    console.log("发送给成员"+vueComponent.tableData[i].name);
                    socket.send(vueComponent.tableData[i].name)
                  }
            }

            // console.log("debug str"+str)
            // socket.send(str);
            // socket.onmessage=function (msg)
          },

          // getSocketFunction(){//收
          //   json=msg.data;
          //   console.log(json);
          // },

          closeWebsocket(){
            //关闭连接
            socket.onclose = function() {
                console.log("websocket已关闭");
            }
            //发生了错误
            socket.onerror = function(msg) {
                console.log("websocket发生了错误:"+msg.data);
            }
          }
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
  .btns{
    margin-left: 20px;
  }
  .btn2{
    margin-top: 13px;
  }

/* 布局框style */
  .el-header{
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 50px;
}

  .el-footer {
  background-color: #B3C0D1;
  color: #333;
  line-height: 80px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  height: 600px;
 
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  
  line-height: 400px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>
