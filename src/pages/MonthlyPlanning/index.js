import React, { Component } from "react";
import {
  Container,
  Header,
  UserBox,
  HeaderTitle,
  ContentBox,
  PageTitle,
  Link,
  ScrollingButtonMenuBox,
  PlanningContent,
  PlanningBox,
  PlanningTitle
} from "./styles";
import APIKit from "../../utils/APIKit";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "../../locales";
import ScrollingButtonMenu from 'react-native-scroll-menu';

let menus = [
  {
      name: 'Dez/21',
      id: '12-2021',
  },
  {
      name: 'Jan/22',
      id: '01-2022',
  },
  {
      name: 'Fev/22',
      id: '02-2022',
  },
  {
      name: 'Mar/22',
      id: '03-2022',
  }
  ,
  {
      name: 'Abr/22',
      id: '04-2022',
  },
  {
      name: 'Mai/22',
      id: '05-2022',
  },
  {
      name: 'Jun/22',
      id: '06-2022',
  },
  {
      name: 'Jul/22',
      id: '07-2022',
  },
  {
      name: 'Ago/22',
      id: '08-2022',
  },
  {
      name: 'Set/22',
      id: '09-2022',
  },
  {
      name: 'Out/22',
      id: '10-2022',
  },
  {
      name: 'Nov/22',
      id: '11-2022',
  }
];

class MonthlyPlanning extends Component {

    constructor() {
        super();
        this.state = {
          errorMessage: "",
          x: [],
          mes: "",
          userId: "",
          isAuthenticated: false,
          userName: "",
          date: new Date(Date.now()),
          showStartDate: false,
          showFinalDate: false,
          start_date: new Date(Date.now()),
          end_date: new Date(Date.now()),
        };
      }
    
      componentWillUnmount() {}
    
      async componentDidMount() {
        const userId = await AsyncStorage.getItem("userId");
        const userName = await AsyncStorage.getItem("username");
    
        if (userId == null || userId == "null") {
          this.props.navigation.navigate("Login");
        } else {
          this.setState({ userId: userId });
          this.setState({ userName: userName });
          this.setState({ isAuthenticated: true });
        }
      }

      async onPressFilter(id) {
        this.setState({ x: [] });
        this.setState({ errorMessage: "" });
        this.setState({ mes: id });

        const onSuccess = ({ data }) => {
            this.setState({ isAuthenticated: true });
            this.setState({ x: data });
            console.log(this.state.x);
            if (this.state.x.length == 0) {
              this.setState({ errorMessage: "Adicione lançamentos e/ou um planejamento nesse mês para ter seu planejamento mensal completo!" });
            }

            var arrayValuePlans = this.state.x.map(function (item, index) {
              return item.valor_planejado
            });

            for(var i = 0; i < arrayValuePlans.length; i++) {
              if (arrayValuePlans[i] == null) {
                this.setState({ errorMessage: "Adicione lançamentos e/ou um planejamento nesse mês para ter seu planejamento mensal completo!" });
              } else {
                this.setState({ errorMessage: "" });
                return
              }
            }
        };
    
        const userId = await AsyncStorage.getItem("userId");
        
        APIKit.get(
            "/api/users/planejamento?user_id=" +
            userId +
            "&mes=" +
            id
        )
        .then(onSuccess);

        this.setState({ x: [] });
        this.setState({ errorMessage: "" });
      }

      async onPressDelete(categoria) {
        console.log(this.state.mes)
        var categoria_id = 0;
        console.log(categoria);

        if (categoria == "Moradia") {
          categoria_id = 1;
        }
        if (categoria == "Supermercado") {
          categoria_id = 2;
        }
        if (categoria == "Transporte") {
          categoria_id = 3;
        }
        if (categoria == "Lazer") {
          categoria_id = 4;
        }
        if (categoria == "Saúde") {
          categoria_id = 5;
        }
        if (categoria == "Contas") {
          categoria_id = 6;
        }
        if (categoria == "Restaurantes") {
          categoria_id = 7;
        }
        if (categoria == "Outros") {
          categoria_id = 8;
        }

        const onSuccess = ({ data }) => {
          this.setState({ isAuthenticated: true });
          this.setState({ x: data });
          console.log(data)
          console.log("deu bom")
        };

        const onFailure = (error) => {
          console.log(error)
          console.log("deu ruim")
        };
  
        const userId = await AsyncStorage.getItem("userId");

        var payload = {
            "user_id": parseInt(userId),
            "mes": this.state.mes,
            "categoria_id": categoria_id,
        }

        console.log(payload)
  
        APIKit.post(
          "/api/users/planejamento", payload)
        .then(onSuccess)
        .catch(onFailure);
        
        this.props.navigation.navigate("Dashboard");
        
      }
      
  render() {
    return (
      <Container>
        <Header>
          <UserBox>
            <FontAwesome name="user-circle" size={26} color="#DAE3E5" />
            <HeaderTitle>Olá, {this.state.userName}!</HeaderTitle>
          </UserBox>
          <AntDesign
            name="close"
            size={24}
            color="#DAE3E5"
            onPress={() => this.props.navigation.navigate("Dashboard")}
          />
        </Header>
        <ContentBox>
            <ScrollingButtonMenuBox>
                <ScrollingButtonMenu
                    items={menus}
                    style={{padding:15}}
                    onPress={(e) => {
                      this.onPressFilter(e.id);
                    }}
                />
            </ScrollingButtonMenuBox>
                
            <PlanningContent>
              <PlanningTitle>
                {this.state.errorMessage}
              </PlanningTitle>
              {this.state.x.map((data, index) => {
                console.log(data)
                if (data.id_categoria === 1) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      console.log(data.valor.gasto);
                      var valor_gasto_1 = data.valor_gasto.split(".");
                      var valor_gasto_final_1 = valor_gasto_1[0] + "," + valor_gasto_1[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_1 = data.valor_planejado.split(".");
                      var valor_planejado_final_1 = valor_planejado_1[0] + "," + valor_planejado_1[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Moradia</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_1 + "/R$" + valor_planejado_final_1 }</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria === 2) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_2 = data.valor_gasto.split(".");
                      var valor_gasto_final_2 = valor_gasto_2[0] + "," + valor_gasto_2[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_2 = data.valor_planejado.split(".");
                      var valor_planejado_final_2 = valor_planejado_2[0] + "," + valor_planejado_2[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Supermercado</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_2 + "/R$" + valor_planejado_final_2}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria == 3) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_3 = data.valor_gasto.split(".");
                      var valor_gasto_final_3 = valor_gasto_3[0] + "," + valor_gasto_3[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_3 = data.valor_planejado.split(".");
                      var valor_planejado_final_3 = valor_planejado_3[0] + "," + valor_planejado_3[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Transporte</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_3 + "/R$" + valor_planejado_final_3}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria == 4) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_4 = data.valor_gasto.split(".");
                      var valor_gasto_final_4 = valor_gasto_4[0] + "," + valor_gasto_4[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_4 = data.valor_planejado.split(".");
                      var valor_planejado_final_4 = valor_planejado_4[0] + "," + valor_planejado_4[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Lazer</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_4 + "/R$" + valor_planejado_final_4}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria == 5) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_5 = data.valor_gasto.split(".");
                      var valor_gasto_final_5 = valor_gasto_5[0] + "," + valor_gasto_5[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_5 = data.valor_planejado.split(".");
                      var valor_planejado_final_5 = valor_planejado_5[0] + "," + valor_planejado_5[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Saúde</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_5 + "/R$" + valor_planejado_final_5}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria == 6) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_6 = data.valor_gasto.split(".");
                      var valor_gasto_final_6 = valor_gasto_6[0] + "," + valor_gasto_6[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_6 = data.valor_planejado.split(".");
                      var valor_planejado_final_6 = valor_planejado_6[0] + "," + valor_planejado_6[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Contas</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_6 + "/R$" + valor_planejado_final_6}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria == 7) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_7 = data.valor_gasto.split(".");
                      var valor_gasto_final_7 = valor_gasto_7[0] + "," + valor_gasto_7[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_7 = data.valor_planejado.split(".");
                      var valor_planejado_final_7 = valor_planejado_7[0] + "," + valor_planejado_7[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Restaurante/Delivery</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_7 + "/R$" + valor_planejado_final_7}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

              {this.state.x.map((data, index) => {
                if (data.id_categoria == 8) {
                  if (data.valor_planejado != null) {
                    if (data.valor_gasto) {
                      var valor_gasto_8 = data.valor_gasto.split(".");
                      var valor_gasto_final_8 = valor_gasto_8[0] + "," + valor_gasto_8[1].slice(0, 2);
                    }
                    if (data.valor_planejado) {
                      var valor_planejado_8 = data.valor_planejado.split(".");
                      var valor_planejado_final_8 = valor_planejado_8[0] + "," + valor_planejado_8[1].slice(0, 2);
                    }
                    return (
                      <PlanningBox key={"planning-box-" + index}>
                        <PlanningTitle>Outros</PlanningTitle>
                        <PlanningTitle>{"R$" + valor_gasto_final_8 + "/R$" + valor_planejado_final_8}</PlanningTitle>
                        <AntDesign name="delete" size={20} color="rgb(80, 125, 188)" 
                          onPress={() => {
                            this.onPressDelete(data.nome_categoria);
                          }}/>
                      </PlanningBox>
                    )
                  }
                }
              })}

            </PlanningContent>

            <Link onPress={() => this.props.navigation.navigate("ManagePlanning")}>
                Adicionar Planejamento
            </Link>
        </ContentBox>
      </Container>
    );
  }
}

export default MonthlyPlanning;