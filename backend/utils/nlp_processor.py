import re
from collections import Counter
from dataclasses import dataclass
from typing import Dict, List, Set, Tuple
from enum import Enum

class Sentiment(Enum):
    PRODUCTIVE = "produtivo"
    UNPRODUCTIVE = "improdutivo"
    NEUTRAL = "neutro"


MIN_WORD_LENGTH = 3
TOP_KEYWORDS_COUNT = 5
MIN_STEMMING_LENGTH = 4
NEUTRAL_CONFIDENCE = 0.5

STOP_WORDS_PT: Set[str] = {
    'a', 'o', 'e', 'é', 'de', 'da', 'do', 'em', 'um', 'uma', 'os', 'as',
    'que', 'se', 'na', 'no', 'para', 'com', 'por', 'mais', 'muito', 'já',
    'ao', 'aos', 'essa', 'esse', 'isso', 'isto', 'aqui', 'ali', 'ser',
    'está', 'foi', 'ter', 'tem', 'são', 'seu', 'sua', 'mas', 'ou', 'como'
}

STOP_WORDS_EN: Set[str] = {
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'here', 'there', 'where', 'when', 'why', 'how', 'who', 'what'
}

STOP_WORDS: Set[str] = STOP_WORDS_PT | STOP_WORDS_EN

PRODUCTIVE_KEYWORDS_PT: Set[str] = {
    'urgente', 'urgência', 'solicitação', 'solicito', 'solicitar',
    'problema', 'problemas', 'erro', 'erros', 'dúvida', 'dúvidas',
    'status', 'atualização', 'atualizar', 'prazo', 'prazos',
    'documento', 'documentos', 'contrato', 'contratos',
    'análise', 'analisar', 'pendente', 'pendentes',
    'favor', 'necessário', 'necessária', 'anexo', 'anexos',
    'informação', 'informações', 'suporte', 'ajuda', 'auxílio',
    'confirmar', 'confirmação', 'nota', 'fiscal', 'pagamento','boleto', 'fatura', 'nota fiscal', 'nf', 'danfe',
    'cobrança', 'débito', 'crédito', 'transferência',
    'pix', 'ted', 'doc', 'saldo', 'extrato',
    'reconciliação', 'conciliação', 'auditoria',
    'compliance', 'regulatório', 'bacen', 'cvm',
    'contábil', 'fiscal', 'tributo', 'imposto',
    'ativo', 'passivo', 'balanço', 'dre'
}

PRODUCTIVE_KEYWORDS_EN: Set[str] = {
    'urgent', 'urgency', 'request', 'requesting', 'issue', 'issues',
    'problem', 'problems', 'error', 'errors', 'question', 'questions',
    'status', 'update', 'updating', 'deadline', 'deadlines',
    'document', 'documents', 'contract', 'contracts',
    'analysis', 'analyze', 'pending', 'please', 'required',
    'attachment', 'attachments', 'information', 'support', 'help',
    'confirm', 'confirmation', 'invoice', 'payment', 'assistance', 'invoice', 'bill', 'receipt', 'statement',
    'balance', 'debit', 'credit', 'transfer',
    'reconciliation', 'audit', 'compliance',
    'regulatory', 'accounting', 'fiscal', 'tax'
}

PRODUCTIVE_KEYWORDS: Set[str] = PRODUCTIVE_KEYWORDS_PT | PRODUCTIVE_KEYWORDS_EN

UNPRODUCTIVE_KEYWORDS_PT: Set[str] = {
    'parabéns', 'feliz', 'felizes', 'felicidade',
    'natal', 'ano novo', 'aniversário', 'páscoa',
    'obrigado', 'obrigada', 'agradecimento', 'agradeço',
    'oi', 'olá', 'ola', 'tchau', 'adeus', 'abraço', 'abraços',
    'marketing', 'promoção', 'promoções', 'oferta', 'ofertas',
    'desconto', 'descontos', 'compre', 'comprar', 'venda',
    'cadastro', 'inscreva', 'clique', 'ganhe', 'grátis'
}

UNPRODUCTIVE_KEYWORDS_EN: Set[str] = {
    'congratulations', 'congrats', 'happy', 'happiness',
    'christmas', 'new year', 'birthday', 'easter',
    'thanks', 'thank you', 'grateful', 'gratitude',
    'hello', 'hi', 'hey', 'bye', 'goodbye',
    'marketing', 'promotion', 'promotions', 'offer', 'offers',
    'discount', 'discounts', 'buy', 'purchase', 'sale',
    'subscribe', 'click', 'win', 'free', 'prize'
}

UNPRODUCTIVE_KEYWORDS: Set[str] = UNPRODUCTIVE_KEYWORDS_PT | UNPRODUCTIVE_KEYWORDS_EN

STEMMING_SUFFIXES_PT: List[str] = [
    'mente', 'ação', 'ções', 'ador', 'adora', 'endo', 'ando',
    'idade', 'ismo', 'ista', 'oso', 'osa', 'ivo', 'iva'
]

STEMMING_SUFFIXES_EN: List[str] = [
    'ing', 'ed', 'ly', 'tion', 'ness', 'ful', 'less',
    'ment', 'able', 'ible', 'ance', 'ence', 'ship'
]

STEMMING_SUFFIXES: List[str] = STEMMING_SUFFIXES_PT + STEMMING_SUFFIXES_EN

@dataclass
class SentimentScore:
    sentiment: str
    confidence: float
    productive_count: int
    unproductive_count: int

    def to_dict(self) -> Dict:
        return {
            'sentiment': self.sentiment,
            'confidence': self.confidence,
            'prod': self.productive_count,
            'unprod': self.unproductive_count
        }


@dataclass
class TextStats:
    original_word_count: int
    processed_word_count: int
    unique_word_count: int

    def to_dict(self) -> Dict:
        return {
            'palavras_original': self.original_word_count,
            'palavras_processadas': self.processed_word_count,
            'palavras_unicas': self.unique_word_count
        }


@dataclass
class ProcessingResult:
    processed_text: str
    keywords: List[Tuple[str, int]]
    sentiment: SentimentScore
    stats: TextStats

    def to_dict(self) -> Dict:
        return {
            'processed_text': self.processed_text,
            'keywords': self.keywords,
            'sentiment': self.sentiment.to_dict(),
            'stats': self.stats.to_dict()
        }

class NLPProcessor:
    def __init__(
        self,
        stop_words: Set[str] = STOP_WORDS,
        productive_signals: Set[str] = PRODUCTIVE_KEYWORDS,
        unproductive_signals: Set[str] = UNPRODUCTIVE_KEYWORDS,
        stemming_suffixes: List[str] = STEMMING_SUFFIXES
    ):
        self.stop_words = stop_words
        self.productive_signals = productive_signals
        self.unproductive_signals = unproductive_signals
        self.stemming_suffixes = stemming_suffixes
    
    def clean_text(self, text: str) -> str:
        text_cleaned = re.sub(
            r'[^a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ0-9\s]',
            ' ',
            text
        )
        
        text_normalized = re.sub(r'\s+', ' ', text_cleaned)
        
        return text_normalized.strip().lower()
    
    def tokenize(self, text: str) -> List[str]:
        return text.split()
    
    def filter_stop_words(self, tokens: List[str]) -> List[str]:
        return [
            token for token in tokens
            if len(token) >= MIN_WORD_LENGTH and token not in self.stop_words
        ]
    
    def tokenize_and_filter(self, text: str) -> List[str]:
        tokens = self.tokenize(text)
        return self.filter_stop_words(tokens)
    
    def apply_stemming(self, word: str) -> str:
        for suffix in self.stemming_suffixes:
            if word.endswith(suffix) and len(word) > len(suffix) + 2:
                return word[:-len(suffix)]
        
        if word.endswith('s') and len(word) > MIN_STEMMING_LENGTH:
            return word[:-1]
        
        return word
    
    def stem_tokens(self, tokens: List[str]) -> List[str]:

        return [self.apply_stemming(token) for token in tokens]
    
    def extract_keywords(
        self,
        tokens: List[str],
        top_n: int = TOP_KEYWORDS_COUNT
    ) -> List[Tuple[str, int]]:

        word_frequency = Counter(tokens)
        return word_frequency.most_common(top_n)
    
    
    def calculate_sentiment_score(self, tokens: List[str]) -> SentimentScore:
        
        productive_count = sum(
            1 for token in tokens
            if token in self.productive_signals
        )
        
        unproductive_count = sum(
            1 for token in tokens
            if token in self.unproductive_signals
        )
        
        total_signals = productive_count + unproductive_count
        
        if total_signals == 0:
            return SentimentScore(
                sentiment=Sentiment.NEUTRAL.value,
                confidence=NEUTRAL_CONFIDENCE,
                productive_count=0,
                unproductive_count=0
            )
        
        is_productive = productive_count > unproductive_count
        confidence = max(productive_count, unproductive_count) / total_signals
        
        sentiment = (
            Sentiment.PRODUCTIVE.value if is_productive
            else Sentiment.UNPRODUCTIVE.value
        )
        
        return SentimentScore(
            sentiment=sentiment,
            confidence=round(confidence, 2),
            productive_count=productive_count,
            unproductive_count=unproductive_count
        )
        
    def preprocess(self, text: str) -> ProcessingResult:
        original_word_count = len(text.split())
        
        cleaned_text = self.clean_text(text)
        
        filtered_tokens = self.tokenize_and_filter(cleaned_text)
        
        stemmed_tokens = self.stem_tokens(filtered_tokens)
        
        keywords = self.extract_keywords(stemmed_tokens)
        
        sentiment = self.calculate_sentiment_score(stemmed_tokens)
        
        stats = TextStats(
            original_word_count=original_word_count,
            processed_word_count=len(stemmed_tokens),
            unique_word_count=len(set(stemmed_tokens))
        )
        
        return ProcessingResult(
            processed_text=' '.join(stemmed_tokens),
            keywords=keywords,
            sentiment=sentiment,
            stats=stats
        )

def process_text(text: str) -> Dict:
    processor = NLPProcessor()
    result = processor.preprocess(text)
    return result.to_dict()

if __name__ == "__main__":
    # Exemplo de uso
    sample_email = """
    Prezados,
    
    Segue em anexo a Nota Fiscal nº 12345.
    Solicito urgente confirmação de recebimento.
    
    Atenciosamente,
    João Silva
    """
    
    processor = NLPProcessor()
    result = processor.preprocess(sample_email)
    
    print("=" * 60)
    print("EXEMPLO DE PROCESSAMENTO NLP")
    print("=" * 60)
    print(f"\n Keywords: {result.keywords}")
    print(f" Sentimento: {result.sentiment.sentiment}")
    print(f" Confiança: {result.sentiment.confidence}")
    print(f" Stats: {result.stats.to_dict()}")