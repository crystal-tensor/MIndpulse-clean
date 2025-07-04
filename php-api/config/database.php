<?php
// 数据库配置
class Database {
    private $host = 'gdm643972455.my3w.com';
    private $db_name = 'gdm643972455_db';
    private $username = 'gdm643972455';
    private $password = '6012.QuPunkmysql';
    private $pdo;

    public function connect() {
        $this->pdo = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8";
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            error_log("连接错误: " . $e->getMessage());
        }
        
        return $this->pdo;
    }
}
?>
